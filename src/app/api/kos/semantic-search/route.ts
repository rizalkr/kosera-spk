/**
 * AI Semantic Search API
 *
 * Public endpoint for natural language search of kos listings.
 * Uses vector similarity for more intuitive search results.
 *
 * @module app/api/kos/semantic-search
 */

import { semanticSearch, findSimilarKos } from '@/lib/ai';
import { ok, fail } from '@/types/api';
import { z } from 'zod';

/** Search request validation schema */
const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500),
  city: z.string().optional(),
  subdistrict: z.string().optional(),
  gender: z.enum(['putra', 'putri', 'campur']).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  minRooms: z.coerce.number().int().min(1).optional(),
  facilities: z.array(z.string()).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/** Similar kos request validation schema */
const similarSchema = z.object({
  kosId: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

/**
 * POST /api/kos/semantic-search
 *
 * Perform semantic search on kos listings using natural language.
 *
 * Body:
 * - query: string - Natural language search query
 * - city?: string - Filter by city
 * - minPrice?: number - Minimum price filter
 * - maxPrice?: number - Maximum price filter
 * - minRooms?: number - Minimum available rooms
 * - facilities?: string[] - Required facilities
 * - limit?: number - Max results (default 20, max 50)
 *
 * Example queries:
 * - "kos dekat kampus dengan wifi dan AC murah"
 * - "tempat tinggal nyaman untuk mahasiswa di Jakarta Selatan"
 * - "kosan furnished dengan dapur bersama"
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = searchSchema.safeParse(body);

    if (!parsed.success) {
      return fail(
        'validation_error',
        'Invalid search request',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    const { query, city, subdistrict, gender, minPrice, maxPrice, minRooms, facilities, limit } = parsed.data;

    const results = await semanticSearch(
      query,
      { city, subdistrict, gender, minPrice, maxPrice, minRooms, facilities },
      limit
    );

    return ok('Search completed', results);
  } catch (error) {
    console.error('Semantic search error:', error);
    return fail('internal_error', 'Search failed', undefined, { status: 500 });
  }
}

/**
 * GET /api/kos/semantic-search?kosId=123&limit=10
 *
 * Find similar kos to a given kos ID.
 * Useful for "You might also like" recommendations.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kosIdParam = searchParams.get('kosId');
    const limitParam = searchParams.get('limit');

    if (!kosIdParam) {
      return fail('validation_error', 'kosId parameter is required', undefined, { status: 400 });
    }

    const parsed = similarSchema.safeParse({
      kosId: kosIdParam,
      limit: limitParam || 10,
    });

    if (!parsed.success) {
      return fail(
        'validation_error',
        'Invalid parameters',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    const { kosId, limit } = parsed.data;
    const similar = await findSimilarKos(kosId, limit);

    return ok('Similar kos found', {
      referenceKosId: kosId,
      similar,
      total: similar.length,
    });
  } catch (error) {
    console.error('Find similar error:', error);
    return fail('internal_error', 'Failed to find similar kos', undefined, { status: 500 });
  }
}
