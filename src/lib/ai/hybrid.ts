/**
 * Hybrid Recommendation Algorithm
 *
 * Menggabungkan Profile Matching (Kusrini, 2007) dengan AI Semantic Search
 * untuk menghasilkan rekomendasi kos yang lebih akurat dan kontekstual.
 *
 * Formula Hybrid Score:
 *   HybridScore = (w_pm * ProfileMatchingScore) + (w_ai * SemanticSimilarityScore)
 *
 * Dimana:
 *   - w_pm: bobot Profile Matching (default 0.7)
 *   - w_ai: bobot AI Semantic (default 0.3)
 *   - ProfileMatchingScore: hasil perhitungan PM-SPK [0-100]
 *   - SemanticSimilarityScore: cosine similarity [0-1] dinormalisasi ke [0-100]
 *
 * Referensi:
 * - Kusrini. (2007). Konsep dan Aplikasi Sistem Pendukung Keputusan. Andi Offset.
 * - Burke, R. (2002). Hybrid Recommender Systems. User Modeling and User-Adapted Interaction.
 *
 * @module lib/ai/hybrid
 */

import { db } from '@/db';
import { kos, posts, users, kosPhotos, userPreferences } from '@/db/schema';
import { eq, and, isNull, sql, gte, lte, inArray } from 'drizzle-orm';
import type { UserPreferencesData, KosMatchingResult } from '@/types/profile-matching';
import {
  calculateMatchingScore,
  DEFAULT_WEIGHT_PRICE,
  DEFAULT_WEIGHT_LOCATION,
  DEFAULT_WEIGHT_FACILITIES,
  DEFAULT_WEIGHT_RATING,
} from '@/lib/profile-matching/scoring';
import { mapDbPreferenceToData } from '@/lib/profile-matching/algorithm';
import { vectorize, AIServiceError } from './client';

// ============================================================
// CONSTANTS & TYPES
// ============================================================

/** Default weights for hybrid scoring */
export const DEFAULT_HYBRID_WEIGHT_PM = 0.7;
export const DEFAULT_HYBRID_WEIGHT_AI = 0.3;

/** Hybrid algorithm options */
interface HybridRecommendationOptions {
  /** Natural language query for semantic matching */
  query?: string;
  /** Weight for Profile Matching score (0-1, default 0.7) */
  weightPM?: number;
  /** Weight for AI Semantic score (0-1, default 0.3) */
  weightAI?: number;
  /** Pagination: page number */
  page?: number;
  /** Pagination: items per page */
  limit?: number;
  /** Minimum hybrid score threshold */
  minScore?: number;
}

/** Extended result with hybrid scoring details */
interface HybridKosResult extends KosMatchingResult {
  /** AI semantic similarity score (0-100) */
  semanticScore: number;
  /** Combined hybrid score */
  hybridScore: number;
  /** Breakdown of hybrid score components */
  hybridDetails: {
    profileMatchingScore: number;
    semanticSimilarityScore: number;
    weightPM: number;
    weightAI: number;
  };
}

/** Hybrid recommendation response */
interface HybridRecommendationResponse {
  recommendations: HybridKosResult[];
  userPreferences: UserPreferencesData | null;
  query: string | null;
  algorithmMode: 'hybrid' | 'profile-matching-only';
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Normalize cosine similarity (0-1) to score (0-100)
 */
const normalizeSemanticScore = (similarity: number): number => {
  // Clamp between 0 and 1, then scale to 0-100
  const clamped = Math.max(0, Math.min(1, similarity));
  return Math.round(clamped * 100);
};

// ============================================================
// MAIN ALGORITHM
// ============================================================

/**
 * Get hybrid recommendations combining Profile Matching and AI Semantic Search.
 *
 * Algorithm:
 * 1. Fetch user preferences (if exists)
 * 2. Fetch all eligible kos with embeddings
 * 3. Calculate Profile Matching score for each kos
 * 4. If query provided, calculate semantic similarity
 * 5. Combine scores using weighted average
 * 6. Sort and paginate results
 *
 * @param userId - User ID for preference lookup
 * @param options - Algorithm options
 * @returns Hybrid recommendations with detailed scoring
 */
export const getHybridRecommendations = async (
  userId: number,
  options: HybridRecommendationOptions = {}
): Promise<HybridRecommendationResponse> => {
  const {
    query,
    weightPM = DEFAULT_HYBRID_WEIGHT_PM,
    weightAI = DEFAULT_HYBRID_WEIGHT_AI,
    page = 1,
    limit = 10,
    minScore = 0,
  } = options;

  const offset = (page - 1) * limit;

  // Validate weights sum to 1
  const totalWeight = weightPM + weightAI;
  const normalizedWeightPM = weightPM / totalWeight;
  const normalizedWeightAI = weightAI / totalWeight;

  // 1. Get user preferences
  const [preferencesRow] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  const preferences = preferencesRow ? mapDbPreferenceToData(preferencesRow) : null;

  // 2. Build base query conditions
  const conditions = [
    isNull(kos.deletedAt),
    isNull(posts.deletedAt),
  ];

  if (preferences?.needsAvailableRoom) {
    conditions.push(
      sql`(${kos.totalRooms} - COALESCE(${kos.occupiedRooms}, 0)) > 0`
    );
  }

  if (preferences?.budgetMax) {
    const maxWithBuffer = Math.round(preferences.budgetMax * 1.3);
    conditions.push(lte(posts.price, maxWithBuffer));
  }

  if (preferences?.minRating) {
    const minWithBuffer = Math.max(1.0, preferences.minRating - 1.5);
    conditions.push(gte(sql`CAST(${posts.averageRating} AS DECIMAL)`, minWithBuffer));
  }

  // 3. Generate query embedding if query provided
  let queryEmbedding: number[] | null = null;
  let algorithmMode: 'hybrid' | 'profile-matching-only' = 'profile-matching-only';

  if (query && query.trim().length > 0) {
    try {
      const vectorResult = await vectorize(query.trim(), 'query');
      queryEmbedding = vectorResult.embedding;
      algorithmMode = 'hybrid';
    } catch (error) {
      if (error instanceof AIServiceError) {
        console.warn('AI service unavailable, falling back to PM-only:', error.message);
      } else {
        throw error;
      }
    }
  }

  // 4. Fetch kos data with optional semantic similarity
  let kosResults;

  if (queryEmbedding) {
    const embeddingLiteral = `[${queryEmbedding.join(',')}]`;

    kosResults = await db
      .select({
        id: kos.id,
        postId: kos.postId,
        name: kos.name,
        address: kos.address,
        city: kos.city,
        facilities: kos.facilities,
        latitude: kos.latitude,
        longitude: kos.longitude,
        totalRooms: kos.totalRooms,
        occupiedRooms: kos.occupiedRooms,
        hasEmbedding: sql<boolean>`${kos.embedding} IS NOT NULL`,
        // Calculate semantic similarity only for kos with embeddings
        semanticSimilarity: sql<number>`
          CASE 
            WHEN ${kos.embedding} IS NOT NULL 
            THEN 1 - (${kos.embedding} <=> ${embeddingLiteral}::vector)
            ELSE 0 
          END
        `,
        title: posts.title,
        description: posts.description,
        price: posts.price,
        averageRating: posts.averageRating,
        reviewCount: posts.reviewCount,
        viewCount: posts.viewCount,
        favoriteCount: posts.favoriteCount,
        photoCount: posts.photoCount,
        isFeatured: posts.isFeatured,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        ownerId: users.id,
        ownerName: users.name,
        ownerUsername: users.username,
        ownerContact: users.contact,
      })
      .from(kos)
      .innerJoin(posts, eq(kos.postId, posts.id))
      .innerJoin(users, eq(posts.userId, users.id))
      .where(and(...conditions));
  } else {
    // No query, fetch without semantic similarity
    kosResults = await db
      .select({
        id: kos.id,
        postId: kos.postId,
        name: kos.name,
        address: kos.address,
        city: kos.city,
        facilities: kos.facilities,
        latitude: kos.latitude,
        longitude: kos.longitude,
        totalRooms: kos.totalRooms,
        occupiedRooms: kos.occupiedRooms,
        hasEmbedding: sql<boolean>`${kos.embedding} IS NOT NULL`,
        semanticSimilarity: sql<number>`0`,
        title: posts.title,
        description: posts.description,
        price: posts.price,
        averageRating: posts.averageRating,
        reviewCount: posts.reviewCount,
        viewCount: posts.viewCount,
        favoriteCount: posts.favoriteCount,
        photoCount: posts.photoCount,
        isFeatured: posts.isFeatured,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        ownerId: users.id,
        ownerName: users.name,
        ownerUsername: users.username,
        ownerContact: users.contact,
      })
      .from(kos)
      .innerJoin(posts, eq(kos.postId, posts.id))
      .innerJoin(users, eq(posts.userId, users.id))
      .where(and(...conditions));
  }

  // 5. Get photos for all kos
  const kosIds = kosResults.map((k) => k.id);
  const allPhotos = kosIds.length > 0
    ? await db
        .select({
          id: kosPhotos.id,
          kosId: kosPhotos.kosId,
          url: kosPhotos.url,
          isPrimary: kosPhotos.isPrimary,
        })
        .from(kosPhotos)
        .where(inArray(kosPhotos.kosId, kosIds))
    : [];

  const photosByKosId = new Map<number, typeof allPhotos>();
  for (const photo of allPhotos) {
    if (!photosByKosId.has(photo.kosId)) {
      photosByKosId.set(photo.kosId, []);
    }
    photosByKosId.get(photo.kosId)!.push(photo);
  }

  // 6. Calculate hybrid scores
  const effectivePreferences: UserPreferencesData = preferences ?? {
    id: 0,
    userId,
    budgetMin: null,
    budgetMax: null,
    preferredCities: [],
    preferredLatitude: null,
    preferredLongitude: null,
    maxDistanceKm: null,
    requiredFacilities: [],
    optionalFacilities: [],
    roomType: 'any',
    minRating: 3.0,
    needsAvailableRoom: true,
    weightPrice: DEFAULT_WEIGHT_PRICE,
    weightLocation: DEFAULT_WEIGHT_LOCATION,
    weightFacilities: DEFAULT_WEIGHT_FACILITIES,
    weightRating: DEFAULT_WEIGHT_RATING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let scoredResults: HybridKosResult[] = kosResults.map((kosRow) => {
    // Calculate Profile Matching score
    const kosData = {
      price: kosRow.price,
      city: kosRow.city,
      latitude: kosRow.latitude,
      longitude: kosRow.longitude,
      facilities: kosRow.facilities,
      averageRating: kosRow.averageRating,
      totalRooms: kosRow.totalRooms,
      occupiedRooms: kosRow.occupiedRooms,
    };

    const matchingResult = calculateMatchingScore(kosData, effectivePreferences);
    const pmScore = matchingResult.score;

    // Get semantic similarity and normalize to 0-100
    const rawSimilarity = Number(kosRow.semanticSimilarity) || 0;
    const semanticScore = normalizeSemanticScore(rawSimilarity);

    // Calculate hybrid score
    let hybridScore: number;
    if (algorithmMode === 'hybrid') {
      hybridScore = Math.round(
        (normalizedWeightPM * pmScore) + (normalizedWeightAI * semanticScore)
      );
    } else {
      // Profile Matching only mode
      hybridScore = pmScore;
    }

    const photos = photosByKosId.get(kosRow.id) ?? [];

    return {
      id: kosRow.id,
      postId: kosRow.postId,
      name: kosRow.name,
      address: kosRow.address,
      city: kosRow.city,
      facilities: kosRow.facilities,
      latitude: kosRow.latitude,
      longitude: kosRow.longitude,
      totalRooms: kosRow.totalRooms,
      occupiedRooms: kosRow.occupiedRooms,
      availableRooms: kosRow.totalRooms - (kosRow.occupiedRooms ?? 0),
      title: kosRow.title,
      description: kosRow.description,
      price: kosRow.price,
      averageRating: kosRow.averageRating,
      reviewCount: kosRow.reviewCount,
      viewCount: kosRow.viewCount,
      favoriteCount: kosRow.favoriteCount,
      photoCount: kosRow.photoCount,
      isFeatured: kosRow.isFeatured,
      owner: {
        id: kosRow.ownerId,
        name: kosRow.ownerName,
        username: kosRow.ownerUsername,
        contact: kosRow.ownerContact,
      },
      photos: photos.map((p) => ({
        id: p.id,
        url: p.url,
        isPrimary: p.isPrimary,
      })),
      matchingScore: pmScore,
      matchingDetails: matchingResult.details,
      distance: matchingResult.distance,
      semanticScore,
      hybridScore,
      hybridDetails: {
        profileMatchingScore: pmScore,
        semanticSimilarityScore: semanticScore,
        weightPM: normalizedWeightPM,
        weightAI: normalizedWeightAI,
      },
    };
  });

  // 7. Filter by minimum score
  if (minScore > 0) {
    scoredResults = scoredResults.filter((r) => r.hybridScore >= minScore);
  }

  // 8. Sort by hybrid score (descending)
  scoredResults.sort((a, b) => b.hybridScore - a.hybridScore);

  // 9. Apply pagination
  const total = scoredResults.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedResults = scoredResults.slice(offset, offset + limit);

  return {
    recommendations: paginatedResults,
    userPreferences: preferences,
    query: query || null,
    algorithmMode,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
