/**
 * Hybrid Recommendations API
 *
 * Endpoint untuk rekomendasi kos menggunakan algoritma hybrid
 * yang menggabungkan Profile Matching (Kusrini, 2007) dengan AI Semantic Search.
 *
 * @module app/api/kos/hybrid-recommendations
 */

import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { getHybridRecommendations, DEFAULT_HYBRID_WEIGHT_PM, DEFAULT_HYBRID_WEIGHT_AI } from '@/lib/ai';
import { ok, fail } from '@/types/api';
import { z } from 'zod';

/** Request validation schema */
const hybridRecommendationSchema = z.object({
  /** Natural language query for semantic matching (optional) */
  query: z.string().max(500).optional(),
  /** Weight for Profile Matching (0-1, default 0.7) */
  weightPM: z.coerce.number().min(0).max(1).default(DEFAULT_HYBRID_WEIGHT_PM),
  /** Weight for AI Semantic (0-1, default 0.3) */
  weightAI: z.coerce.number().min(0).max(1).default(DEFAULT_HYBRID_WEIGHT_AI),
  /** Page number */
  page: z.coerce.number().int().min(1).default(1),
  /** Items per page */
  limit: z.coerce.number().int().min(1).max(50).default(10),
  /** Minimum hybrid score threshold */
  minScore: z.coerce.number().min(0).max(100).default(0),
});

/**
 * POST /api/kos/hybrid-recommendations
 *
 * Get hybrid recommendations for authenticated renter.
 * Combines Profile Matching SPK with AI semantic understanding.
 *
 * Body:
 * - query?: string - Natural language search (e.g., "kos dekat kampus dengan wifi")
 * - weightPM?: number - Profile Matching weight (default 0.7)
 * - weightAI?: number - AI Semantic weight (default 0.3)
 * - page?: number - Page number (default 1)
 * - limit?: number - Items per page (default 10, max 50)
 * - minScore?: number - Minimum hybrid score (default 0)
 *
 * Response includes:
 * - recommendations: Array of kos with hybrid scoring details
 * - userPreferences: User's saved preferences (if any)
 * - algorithmMode: 'hybrid' or 'profile-matching-only'
 * - pagination: Standard pagination info
 *
 * Each recommendation contains:
 * - matchingScore: Profile Matching score (0-100)
 * - semanticScore: AI similarity score (0-100)
 * - hybridScore: Combined weighted score
 * - hybridDetails: Breakdown of score calculation
 */
async function hybridRecommendationsHandler(request: AuthenticatedRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = hybridRecommendationSchema.safeParse(body);

    if (!parsed.success) {
      return fail(
        'validation_error',
        'Invalid request parameters',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    const { query, weightPM, weightAI, page, limit, minScore } = parsed.data;
    const userId = request.user!.userId;

    const result = await getHybridRecommendations(userId, {
      query,
      weightPM,
      weightAI,
      page,
      limit,
      minScore,
    });

    return ok('Hybrid recommendations retrieved', result);
  } catch (error) {
    console.error('Hybrid recommendations error:', error);
    return fail('internal_error', 'Failed to get recommendations', undefined, { status: 500 });
  }
}

/**
 * GET /api/kos/hybrid-recommendations
 *
 * Get hybrid recommendations with query parameters (alternative to POST).
 * Useful for simple requests without complex filtering.
 */
async function hybridRecommendationsGetHandler(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = hybridRecommendationSchema.safeParse({
      query: searchParams.get('query') || undefined,
      weightPM: searchParams.get('weightPM') || DEFAULT_HYBRID_WEIGHT_PM,
      weightAI: searchParams.get('weightAI') || DEFAULT_HYBRID_WEIGHT_AI,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      minScore: searchParams.get('minScore') || 0,
    });

    if (!parsed.success) {
      return fail(
        'validation_error',
        'Invalid query parameters',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    const { query, weightPM, weightAI, page, limit, minScore } = parsed.data;
    const userId = request.user!.userId;

    const result = await getHybridRecommendations(userId, {
      query,
      weightPM,
      weightAI,
      page,
      limit,
      minScore,
    });

    return ok('Hybrid recommendations retrieved', result);
  } catch (error) {
    console.error('Hybrid recommendations error:', error);
    return fail('internal_error', 'Failed to get recommendations', undefined, { status: 500 });
  }
}

// Apply authentication (all authenticated users can access)
export const POST = withAuth(hybridRecommendationsHandler);
export const GET = withAuth(hybridRecommendationsGetHandler);
