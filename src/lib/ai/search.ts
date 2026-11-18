/**
 * AI Semantic Search Service
 *
 * Provides vector similarity search using pgvector for kos listings.
 * Queries are converted to embeddings and matched against stored kos embeddings.
 *
 * @module lib/ai/search
 */

import { db } from '@/db';
import { kos, posts } from '@/db/schema';
import { eq, and, isNull, sql, gte, lte, ilike, or } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { vectorize, AIServiceError } from './client';

/** Search filters for kos listings */
interface SearchFilters {
  city?: string;
  subdistrict?: string;
  gender?: 'putra' | 'putri' | 'campur';
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  facilities?: string[];
}

/** Single search result with similarity score */
interface SearchResult {
  id: number;
  postId: number;
  name: string;
  address: string;
  city: string;
  subdistrict: string | null;
  gender: string | null;
  roomSize: string | null;
  facilities: string | null;
  nearbyFacilities: string | null;
  rules: string | null;
  totalRooms: number;
  occupiedRooms: number | null;
  availableRooms: number;
  latitude: number | null;
  longitude: number | null;
  title: string;
  description: string;
  price: number;
  isFeatured: boolean;
  similarityScore: number;
}

/** Semantic search response */
interface SemanticSearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  searchType: 'semantic' | 'fallback';
}

/** Build shared SQL filter conditions for semantic and fallback search */
const buildFilterConditions = (filters: SearchFilters): SQL[] => {
  const conditions: SQL[] = [
    isNull(kos.deletedAt),
    isNull(posts.deletedAt),
  ];

  if (filters.city) {
    conditions.push(ilike(kos.city, `%${filters.city.trim()}%`));
  }
  if (filters.subdistrict) {
    conditions.push(ilike(kos.subdistrict, `%${filters.subdistrict.trim()}%`));
  }
  if (filters.gender) {
    conditions.push(eq(kos.gender, filters.gender));
  }
  if (filters.minPrice !== undefined) {
    conditions.push(gte(posts.price, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(posts.price, filters.maxPrice));
  }
  if (filters.minRooms !== undefined) {
    conditions.push(
      sql`${kos.totalRooms} - COALESCE(${kos.occupiedRooms}, 0) >= ${filters.minRooms}`
    );
  }
  if (filters.facilities && filters.facilities.length > 0) {
    const facilityConditions = filters.facilities.map((f) =>
      ilike(kos.facilities, `%${f}%`)
    );
    let facilityOr: SQL = facilityConditions[0];
    for (let i = 1; i < facilityConditions.length; i++) {
      facilityOr = or(facilityOr, facilityConditions[i]) as SQL;
    }
    conditions.push(facilityOr);
  }

  return conditions;
};

/**
 * Perform semantic search using vector similarity
 *
 * Uses pgvector's cosine distance to find kos listings most similar
 * to the query. Falls back to text search if vector search fails.
 *
 * @param query - Natural language search query
 * @param filters - Optional filters for price, city, etc.
 * @param limit - Maximum number of results
 * @returns Search results with similarity scores
 */
export const semanticSearch = async (
  query: string,
  filters: SearchFilters = {},
  limit: number = 20
): Promise<SemanticSearchResponse> => {
  // Validate query
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return {
      query: '',
      results: [],
      total: 0,
      searchType: 'semantic',
    };
  }

  try {
    // Generate query embedding
    const queryResult = await vectorize(trimmedQuery, 'query');
    const queryEmbedding = queryResult.embedding;

    // Build filter conditions
    const conditions = buildFilterConditions(filters);

    // Add condition: only search kos with embeddings
    conditions.push(sql`${kos.embedding} IS NOT NULL`);

    // Format embedding for pgvector
    const embeddingLiteral = `[${queryEmbedding.join(',')}]`;

    // Execute semantic search using cosine distance.
    // Enable pgvector 0.8+ iterative HNSW scan so SQL filters (city, gender, price)
    // do not truncate results to the global top-ef_search candidates.
    const results = await db.transaction(async (tx) => {
      await tx.execute(sql`SET LOCAL hnsw.iterative_scan = relaxed_order`);
      return tx
        .select({
          id: kos.id,
          postId: kos.postId,
          name: kos.name,
          address: kos.address,
          city: kos.city,
          subdistrict: kos.subdistrict,
          gender: kos.gender,
          roomSize: kos.roomSize,
          facilities: kos.facilities,
          nearbyFacilities: kos.nearbyFacilities,
          rules: kos.rules,
          totalRooms: kos.totalRooms,
          occupiedRooms: kos.occupiedRooms,
          latitude: kos.latitude,
          longitude: kos.longitude,
          title: posts.title,
          description: posts.description,
          price: posts.price,
          isFeatured: posts.isFeatured,
          // Cosine similarity: 1 - cosine_distance
          similarityScore: sql<number>`1 - (${kos.embedding} <=> ${embeddingLiteral}::vector)`,
        })
        .from(kos)
        .innerJoin(posts, eq(kos.postId, posts.id))
        .where(and(...conditions))
        .orderBy(sql`${kos.embedding} <=> ${embeddingLiteral}::vector`)
        .limit(limit);
    });

    const searchResults: SearchResult[] = results.map((r) => ({
      ...r,
      availableRooms: r.totalRooms - (r.occupiedRooms || 0),
      similarityScore: Number(r.similarityScore),
    }));

    return {
      query: trimmedQuery,
      results: searchResults,
      total: searchResults.length,
      searchType: 'semantic',
    };
  } catch (error) {
    // If AI service fails, fall back to text search
    if (error instanceof AIServiceError) {
      console.warn('AI service unavailable, falling back to text search:', error.message);
      return fallbackTextSearch(trimmedQuery, filters, limit);
    }
    throw error;
  }
};

/**
 * Fallback text search when semantic search is unavailable
 *
 * Uses traditional LIKE queries on text fields.
 */
const fallbackTextSearch = async (
  query: string,
  filters: SearchFilters,
  limit: number
): Promise<SemanticSearchResponse> => {
  const conditions = buildFilterConditions(filters);

  // Text search conditions
  const searchPattern = `%${query}%`;
  const textSearchConditions: SQL[] = [
    ilike(kos.name, searchPattern),
    ilike(kos.address, searchPattern),
    ilike(kos.city, searchPattern),
    ilike(kos.subdistrict, searchPattern),
    ilike(posts.title, searchPattern),
    ilike(posts.description, searchPattern),
  ];
  let textOr: SQL = textSearchConditions[0];
  for (let i = 1; i < textSearchConditions.length; i++) {
    textOr = or(textOr, textSearchConditions[i]) as SQL;
  }
  conditions.push(textOr);

  const results = await db
    .select({
      id: kos.id,
      postId: kos.postId,
      name: kos.name,
      address: kos.address,
      city: kos.city,
      subdistrict: kos.subdistrict,
      gender: kos.gender,
      roomSize: kos.roomSize,
      facilities: kos.facilities,
      nearbyFacilities: kos.nearbyFacilities,
      rules: kos.rules,
      totalRooms: kos.totalRooms,
      occupiedRooms: kos.occupiedRooms,
      latitude: kos.latitude,
      longitude: kos.longitude,
      title: posts.title,
      description: posts.description,
      price: posts.price,
      isFeatured: posts.isFeatured,
    })
    .from(kos)
    .innerJoin(posts, eq(kos.postId, posts.id))
    .where(and(...conditions))
    .orderBy(posts.isFeatured)
    .limit(limit);

  const searchResults: SearchResult[] = results.map((r) => ({
    ...r,
    availableRooms: r.totalRooms - (r.occupiedRooms || 0),
    similarityScore: 0, // No similarity score for text search
  }));

  return {
    query,
    results: searchResults,
    total: searchResults.length,
    searchType: 'fallback',
  };
};

/**
 * Find similar kos to a given kos ID
 *
 * Uses the existing embedding of a kos to find similar listings.
 *
 * @param kosId - ID of the reference kos
 * @param limit - Maximum number of similar kos to return
 * @returns Array of similar kos with similarity scores
 */
export const findSimilarKos = async (
  kosId: number,
  limit: number = 10
): Promise<SearchResult[]> => {
  // Get the source kos embedding
  const sourceKos = await db
    .select({
      embedding: kos.embedding,
      city: kos.city,
    })
    .from(kos)
    .where(eq(kos.id, kosId))
    .limit(1);

  if (sourceKos.length === 0 || !sourceKos[0].embedding) {
    return [];
  }

  const sourceEmbedding = sourceKos[0].embedding;
  const embeddingLiteral = `[${sourceEmbedding.join(',')}]`;

  // Find similar kos (excluding the source)
  const results = await db
    .select({
      id: kos.id,
      postId: kos.postId,
      name: kos.name,
      address: kos.address,
      city: kos.city,
      subdistrict: kos.subdistrict,
      gender: kos.gender,
      roomSize: kos.roomSize,
      facilities: kos.facilities,
      nearbyFacilities: kos.nearbyFacilities,
      rules: kos.rules,
      totalRooms: kos.totalRooms,
      occupiedRooms: kos.occupiedRooms,
      latitude: kos.latitude,
      longitude: kos.longitude,
      title: posts.title,
      description: posts.description,
      price: posts.price,
      isFeatured: posts.isFeatured,
      similarityScore: sql<number>`1 - (${kos.embedding} <=> ${embeddingLiteral}::vector)`,
    })
    .from(kos)
    .innerJoin(posts, eq(kos.postId, posts.id))
    .where(
      and(
        sql`${kos.id} != ${kosId}`,
        sql`${kos.embedding} IS NOT NULL`,
        isNull(kos.deletedAt),
        isNull(posts.deletedAt)
      )
    )
    .orderBy(sql`${kos.embedding} <=> ${embeddingLiteral}::vector`)
    .limit(limit);

  return results.map((r) => ({
    ...r,
    availableRooms: r.totalRooms - (r.occupiedRooms || 0),
    similarityScore: Number(r.similarityScore),
  }));
};
