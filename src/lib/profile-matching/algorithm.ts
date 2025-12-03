/**
 * Profile Matching Algorithm
 * 
 * Main algorithm for calculating profile matching recommendations.
 * Combines all scoring functions to produce ranked kos recommendations.
 */

import { db } from '@/db';
import { kos, posts, users, kosPhotos, userPreferences } from '@/db/schema';
import { eq, and, isNull, sql, gte, lte, inArray } from 'drizzle-orm';
import type { UserPreferencesData, KosMatchingResult, ProfileMatchingResponse } from '@/types/profile-matching';
import { calculateMatchingScore } from './scoring';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Parse JSON array string to string array
 */
const parseJsonArray = (jsonString: string | null): string[] => {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Convert database preference row to UserPreferencesData
 */
export const mapDbPreferenceToData = (row: typeof userPreferences.$inferSelect): UserPreferencesData => {
  return {
    id: row.id,
    userId: row.userId,
    budgetMin: row.budgetMin,
    budgetMax: row.budgetMax,
    preferredCities: parseJsonArray(row.preferredCities),
    preferredLatitude: row.preferredLatitude,
    preferredLongitude: row.preferredLongitude,
    maxDistanceKm: row.maxDistanceKm ? parseFloat(String(row.maxDistanceKm)) : null,
    requiredFacilities: parseJsonArray(row.requiredFacilities),
    optionalFacilities: parseJsonArray(row.optionalFacilities),
    roomType: (row.roomType as 'single' | 'shared' | 'any') || 'any',
    minRating: row.minRating ? parseFloat(String(row.minRating)) : 3.0,
    needsAvailableRoom: row.needsAvailableRoom ?? true,
    weightPrice: row.weightPrice ?? 30,
    weightLocation: row.weightLocation ?? 25,
    weightFacilities: row.weightFacilities ?? 25,
    weightRating: row.weightRating ?? 20,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
};

// ============================================================
// MAIN ALGORITHM
// ============================================================

interface ProfileMatchingOptions {
  page?: number;
  limit?: number;
  minScore?: number;
}

/**
 * Get profile matching recommendations for a user.
 * 
 * @param userId - User ID to get recommendations for
 * @param options - Pagination and filter options
 * @returns Profile matching response with recommendations
 */
export const getProfileMatchingRecommendations = async (
  userId: number,
  options: ProfileMatchingOptions = {}
): Promise<ProfileMatchingResponse> => {
  const { page = 1, limit = 10, minScore = 0 } = options;
  const offset = (page - 1) * limit;

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

  // Apply availability filter if user needs available room
  if (preferences?.needsAvailableRoom) {
    conditions.push(
      sql`(${kos.totalRooms} - COALESCE(${kos.occupiedRooms}, 0)) > 0`
    );
  }

  // Apply budget filter for initial filtering (optimization)
  if (preferences?.budgetMax) {
    // Allow some buffer above max budget
    const maxWithBuffer = Math.round(preferences.budgetMax * 1.3);
    conditions.push(lte(posts.price, maxWithBuffer));
  }

  // Apply minimum rating filter
  if (preferences?.minRating) {
    const minWithBuffer = Math.max(1.0, preferences.minRating - 1.5);
    conditions.push(gte(sql`CAST(${posts.averageRating} AS DECIMAL)`, minWithBuffer));
  }

  // Apply city filter if preferences exist
  if (preferences?.preferredCities && preferences.preferredCities.length > 0) {
    // Don't filter by city in SQL, we'll score it instead
    // This allows showing kos from other cities with lower scores
  }

  // 3. Fetch all potential kos
  const kosResults = await db
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

  // 4. Get photos for all kos
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

  // Group photos by kosId
  const photosByKosId = new Map<number, typeof allPhotos>();
  for (const photo of allPhotos) {
    if (!photosByKosId.has(photo.kosId)) {
      photosByKosId.set(photo.kosId, []);
    }
    photosByKosId.get(photo.kosId)!.push(photo);
  }

  // 5. Calculate matching scores
  let scoredResults: KosMatchingResult[] = kosResults.map((kosRow) => {
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

    // Use default preferences if user has none
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
      weightPrice: 30,
      weightLocation: 25,
      weightFacilities: 25,
      weightRating: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const matchingResult = calculateMatchingScore(kosData, effectivePreferences);

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
      matchingScore: matchingResult.score,
      matchingDetails: matchingResult.details,
      distance: matchingResult.distance,
    };
  });

  // 6. Filter by minimum score
  if (minScore > 0) {
    scoredResults = scoredResults.filter((r) => r.matchingScore >= minScore);
  }

  // 7. Sort by matching score (descending)
  scoredResults.sort((a, b) => b.matchingScore - a.matchingScore);

  // 8. Apply pagination
  const total = scoredResults.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedResults = scoredResults.slice(offset, offset + limit);

  return {
    recommendations: paginatedResults,
    userPreferences: preferences,
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

/**
 * Get profile matching for a specific kos (single item scoring).
 * Useful for showing match score on detail pages.
 * 
 * @param kosId - Kos ID
 * @param userId - User ID
 * @returns Matching result or null if not found
 */
export const getKosMatchingScore = async (
  kosId: number,
  userId: number
): Promise<KosMatchingResult | null> => {
  // Get user preferences
  const [preferencesRow] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (!preferencesRow) {
    return null; // No preferences to match against
  }

  const preferences = mapDbPreferenceToData(preferencesRow);

  // Get kos data
  const [kosRow] = await db
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
      title: posts.title,
      description: posts.description,
      price: posts.price,
      averageRating: posts.averageRating,
      reviewCount: posts.reviewCount,
      viewCount: posts.viewCount,
      favoriteCount: posts.favoriteCount,
      photoCount: posts.photoCount,
      isFeatured: posts.isFeatured,
      ownerId: users.id,
      ownerName: users.name,
      ownerUsername: users.username,
      ownerContact: users.contact,
    })
    .from(kos)
    .innerJoin(posts, eq(kos.postId, posts.id))
    .innerJoin(users, eq(posts.userId, users.id))
    .where(eq(kos.id, kosId))
    .limit(1);

  if (!kosRow) {
    return null;
  }

  // Get photos
  const photos = await db
    .select({
      id: kosPhotos.id,
      url: kosPhotos.url,
      isPrimary: kosPhotos.isPrimary,
    })
    .from(kosPhotos)
    .where(eq(kosPhotos.kosId, kosId));

  // Calculate matching score
  const matchingResult = calculateMatchingScore(
    {
      price: kosRow.price,
      city: kosRow.city,
      latitude: kosRow.latitude,
      longitude: kosRow.longitude,
      facilities: kosRow.facilities,
      averageRating: kosRow.averageRating,
      totalRooms: kosRow.totalRooms,
      occupiedRooms: kosRow.occupiedRooms,
    },
    preferences
  );

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
    photos,
    matchingScore: matchingResult.score,
    matchingDetails: matchingResult.details,
    distance: matchingResult.distance,
  };
};
