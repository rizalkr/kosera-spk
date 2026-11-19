/**
 * AI Embedding Indexer Service
 *
 * Service for generating and storing AI embeddings for kos listings.
 * Combines kos data into rich text descriptions and vectorizes them
 * for semantic similarity search.
 *
 * @module lib/ai/indexer
 */

import { db } from '@/db';
import { kos, posts } from '@/db/schema';
import { eq, isNull, and, sql } from 'drizzle-orm';
import { after } from 'next/server';
import { vectorize, vectorizeBatch, AIServiceError } from './client';

/** Kos data needed for building embedding text */
interface KosIndexData {
  id: number;
  name: string;
  address: string;
  city: string;
  facilities: string | null;
  gender?: string | null;
  subdistrict?: string | null;
  roomSize?: string | null;
  nearbyFacilities?: string | null;
  rules?: string | null;
  postTitle: string;
  postDescription: string;
  price: number;
  totalRooms: number;
  occupiedRooms: number | null;
}

/** Result of indexing operation */
interface IndexResult {
  kosId: number;
  success: boolean;
  error?: string;
}

/** Batch indexing summary */
interface IndexingSummary {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: IndexResult[];
}

/**
 * Build a rich text description for AI embedding
 *
 * Combines all relevant kos information into a single text string
 * that captures semantic meaning for similarity search.
 *
 * @param data - Kos and post data
 * @returns Combined text for embedding
 */
export const buildEmbeddingText = (data: KosIndexData): string => {
  const parts: string[] = [];

  // Location & gender context
  const genderLabel = data.gender
    ? ` (Kos ${data.gender.charAt(0).toUpperCase()}${data.gender.slice(1).toLowerCase()})`
    : '';
  const locationParts = [data.address];
  if (
    data.subdistrict &&
    !data.address.toLowerCase().includes(data.subdistrict.toLowerCase())
  ) {
    locationParts.push(data.subdistrict);
  }
  locationParts.push(data.city);
  parts.push(`Kos ${data.name}${genderLabel} berlokasi di ${locationParts.filter(Boolean).join(', ')}.`);

  // Price, room size, and availability
  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(data.price);

  const availableRooms = data.totalRooms - (data.occupiedRooms || 0);
  const sizeSegment = data.roomSize ? ` Ukuran kamar ${data.roomSize}.` : '';
  parts.push(
    `Harga sewa ${priceFormatted} per bulan dengan ${availableRooms} kamar tersedia dari ${data.totalRooms} total kamar.${sizeSegment}`
  );

  // Post details
  parts.push(data.postTitle);
  parts.push(data.postDescription);

  // Facilities
  if (data.facilities) {
    parts.push(`Fasilitas yang tersedia: ${data.facilities}.`);
  }

  // Nearby landmarks / public places
  if (data.nearbyFacilities) {
    parts.push(`Lokasi dekat dengan: ${data.nearbyFacilities}.`);
  }

  // Kos rules
  if (data.rules) {
    parts.push(`Peraturan kos: ${data.rules}.`);
  }

  return parts.join(' ').trim();
};

/**
 * Fetch kos listings that need embedding generation
 *
 * @param limit - Maximum number of kos to fetch
 * @returns Array of kos data for indexing
 */
export const getKosWithoutEmbedding = async (
  limit: number = 50
): Promise<KosIndexData[]> => {
  const result = await db
    .select({
      id: kos.id,
      name: kos.name,
      address: kos.address,
      city: kos.city,
      facilities: kos.facilities,
      gender: kos.gender,
      subdistrict: kos.subdistrict,
      roomSize: kos.roomSize,
      nearbyFacilities: kos.nearbyFacilities,
      rules: kos.rules,
      totalRooms: kos.totalRooms,
      occupiedRooms: kos.occupiedRooms,
      postTitle: posts.title,
      postDescription: posts.description,
      price: posts.price,
    })
    .from(kos)
    .innerJoin(posts, eq(kos.postId, posts.id))
    .where(
      and(
        isNull(kos.embedding), // No embedding yet
        isNull(kos.deletedAt), // Not soft-deleted
        isNull(posts.deletedAt) // Post not soft-deleted
      )
    )
    .limit(limit);

  return result;
};

/**
 * Index a single kos listing
 *
 * Generates embedding and stores it in the database.
 *
 * @param kosId - ID of kos to index
 * @returns Result of indexing operation
 */
export const indexSingleKos = async (kosId: number): Promise<IndexResult> => {
  try {
    // Fetch kos data
    const result = await db
      .select({
        id: kos.id,
        name: kos.name,
        address: kos.address,
        city: kos.city,
        facilities: kos.facilities,
        gender: kos.gender,
        subdistrict: kos.subdistrict,
        roomSize: kos.roomSize,
        nearbyFacilities: kos.nearbyFacilities,
        rules: kos.rules,
        totalRooms: kos.totalRooms,
        occupiedRooms: kos.occupiedRooms,
        postTitle: posts.title,
        postDescription: posts.description,
        price: posts.price,
      })
      .from(kos)
      .innerJoin(posts, eq(kos.postId, posts.id))
      .where(eq(kos.id, kosId))
      .limit(1);

    if (result.length === 0) {
      return { kosId, success: false, error: 'Kos not found' };
    }

    const kosData = result[0];
    const embeddingText = buildEmbeddingText(kosData);

    // Generate embedding
    const vectorResult = await vectorize(embeddingText, 'passage');

    // Store embedding and full text in database
    await db
      .update(kos)
      .set({
        descriptionFull: embeddingText,
        embedding: vectorResult.embedding,
      })
      .where(eq(kos.id, kosId));

    return { kosId, success: true };
  } catch (error) {
    const errorMessage =
      error instanceof AIServiceError
        ? error.detail || error.message
        : error instanceof Error
          ? error.message
          : 'Unknown error';

    return { kosId, success: false, error: errorMessage };
  }
};

/**
 * Index multiple kos listings in batch
 *
 * More efficient than individual indexing for bulk operations.
 * Processes kos in batches to avoid memory issues.
 *
 * @param batchSize - Number of kos to process per batch
 * @param maxTotal - Maximum total kos to process
 * @returns Summary of indexing operation
 */
export const indexBatch = async (
  batchSize: number = 20,
  maxTotal: number = 100
): Promise<IndexingSummary> => {
  const results: IndexResult[] = [];
  let processed = 0;

  while (processed < maxTotal) {
    // Fetch next batch of kos without embeddings
    const kosList = await getKosWithoutEmbedding(
      Math.min(batchSize, maxTotal - processed)
    );

    if (kosList.length === 0) {
      break; // No more kos to process
    }

    // Build embedding texts
    const texts = kosList.map(buildEmbeddingText);

    try {
      // Batch vectorize
      const batchResult = await vectorizeBatch(texts, 'passage');

      // Store embeddings in database concurrently per batch
      await Promise.all(
        kosList.map((kosData, i) =>
          db
            .update(kos)
            .set({
              descriptionFull: texts[i],
              embedding: batchResult.results[i].embedding,
            })
            .where(eq(kos.id, kosData.id))
        )
      );
      for (const kosData of kosList) {
        results.push({ kosId: kosData.id, success: true });
      }
    } catch (error) {
      // If batch fails, fallback to individual processing
      console.error('Batch vectorization failed, falling back to individual:', error);

      for (let i = 0; i < kosList.length; i++) {
        const result = await indexSingleKos(kosList[i].id);
        results.push(result);
      }
    }

    processed += kosList.length;
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    totalProcessed: processed,
    successful,
    failed,
    results,
  };
};

/**
 * Reindex a specific kos (update existing embedding)
 *
 * Use this when kos data has changed and embedding needs refresh.
 *
 * @param kosId - ID of kos to reindex
 * @returns Result of reindexing operation
 */
export const reindexKos = async (kosId: number): Promise<IndexResult> => {
  // Same as indexSingleKos - it will overwrite existing embedding
  return indexSingleKos(kosId);
};

/** Why a re-index was scheduled (used for structured logs only) */
export type KosReindexReason = 'create' | 'update' | 'restore' | 'manual';

/**
 * Run a re-index and swallow every failure. Never throws.
 *
 * Exported for tests and for callers that want to await completion
 * (e.g. scripts). API routes should use `scheduleKosReindex` instead.
 */
export const runKosReindexSafely = async (
  kosId: number,
  reason: KosReindexReason = 'manual'
): Promise<IndexResult> => {
  try {
    const result = await reindexKos(kosId);
    if (!result.success) {
      console.warn('[ai.reindex] Embedding refresh failed', {
        kosId,
        reason,
        error: result.error,
      });
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[ai.reindex] Unexpected embedding refresh error', { kosId, reason, error: message });
    return { kosId, success: false, error: message };
  }
};

/**
 * Schedule a non-blocking embedding refresh for a kos listing.
 *
 * Call after the kos/post mutation has been written. Uses Next.js `after()`
 * so the work runs once the response has been sent, keeping CRUD latency
 * unchanged. Outside a request scope (scripts, tests without a request
 * context) `after()` throws; we then fall back to fire-and-forget.
 *
 * The mutation response is never affected: if the embedding service is
 * offline, a structured warning is logged and the kos keeps its previous
 * embedding (it can be repaired later via the admin AI indexing endpoint).
 */
export const scheduleKosReindex = (kosId: number, reason: KosReindexReason = 'update'): void => {
  if (!Number.isInteger(kosId) || kosId <= 0) return;

  const task = async (): Promise<void> => {
    await runKosReindexSafely(kosId, reason);
  };

  try {
    after(task);
  } catch {
    void task();
  }
};

/**
 * Get indexing status/statistics
 *
 * @returns Object with counts of indexed vs unindexed kos
 */
export const getIndexingStats = async (): Promise<{
  total: number;
  indexed: number;
  unindexed: number;
  percentComplete: number;
}> => {
  const result = await db
    .select({
      total: sql<number>`count(*)`,
      indexed: sql<number>`count(${kos.embedding})`,
    })
    .from(kos)
    .where(isNull(kos.deletedAt));

  const total = Number(result[0].total);
  const indexed = Number(result[0].indexed);
  const unindexed = total - indexed;
  const percentComplete = total > 0 ? Math.round((indexed / total) * 100) : 0;

  return { total, indexed, unindexed, percentComplete };
};
