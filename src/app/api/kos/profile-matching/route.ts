import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { ok, fail } from '@/types/api';
import { ERROR_CODES } from '@/types/error-codes';
import { getProfileMatchingRecommendations } from '@/lib/profile-matching';
import { z } from 'zod';

// Query parameter validation schema
const querySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  min_score: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  // Geolocation fallback (used when user hasn't set preferences)
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
});

/**
 * GET /api/kos/profile-matching
 * Get kos recommendations based on user profile matching
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - min_score: Minimum matching score to include (default: 0)
 * 
 * Requires authentication. Returns personalized recommendations
 * based on user preferences. If no preferences set, returns
 * recommendations with neutral scoring.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // Authenticate user
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return fail(
        ERROR_CODES.unauthorized,
        'Authentication required. Please login to get personalized recommendations.',
        undefined,
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return fail(ERROR_CODES.invalid_token, 'Invalid or expired token', undefined, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = querySchema.safeParse(raw);

    if (!parsed.success) {
      return fail(
        ERROR_CODES.validation_error,
        'Invalid query parameters',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    // Extract and validate parameters
    const page = parsed.data.page ? parseInt(parsed.data.page, 10) : 1;
    const limit = parsed.data.limit ? Math.min(parseInt(parsed.data.limit, 10), 50) : 10;
    const minScore = parsed.data.min_score ? parseFloat(parsed.data.min_score) : 0;
    
    // Geolocation fallback parameters
    const latitude = parsed.data.latitude ? parseFloat(parsed.data.latitude) : undefined;
    const longitude = parsed.data.longitude ? parseFloat(parsed.data.longitude) : undefined;

    if (page < 1) {
      return fail(ERROR_CODES.invalid_pagination, 'Page must be >= 1', undefined, { status: 400 });
    }

    if (limit < 1) {
      return fail(ERROR_CODES.invalid_pagination, 'Limit must be >= 1', undefined, { status: 400 });
    }

    if (minScore < 0 || minScore > 5) {
      return fail(
        ERROR_CODES.validation_error,
        'min_score must be between 0 and 5',
        undefined,
        { status: 400 }
      );
    }

    // Get profile matching recommendations
    const result = await getProfileMatchingRecommendations(payload.userId, {
      page,
      limit,
      minScore,
      fallbackLatitude: latitude,
      fallbackLongitude: longitude,
    });

    // Build response message
    let message = 'Profile matching recommendations retrieved successfully';
    if (!result.userPreferences) {
      message += '. Note: No preferences set. Set your preferences for more accurate recommendations.';
    }

    return ok(message, result);
  } catch (error) {
    console.error('Error getting profile matching recommendations:', error);
    return fail(
      ERROR_CODES.internal_error,
      'Failed to get recommendations',
      undefined,
      { status: 500 }
    );
  }
}
