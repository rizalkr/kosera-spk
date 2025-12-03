import { db } from '@/db';
import { userPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { ok, fail } from '@/types/api';
import { ERROR_CODES } from '@/types/error-codes';
import { userPreferencesSchema, userPreferencesUpdateSchema } from '@/types/profile-matching';
import { mapDbPreferenceToData } from '@/lib/profile-matching';

/**
 * GET /api/user/preferences
 * Get current user's preferences for profile matching
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // Authenticate user
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return fail(ERROR_CODES.unauthorized, 'Authentication required', undefined, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return fail(ERROR_CODES.invalid_token, 'Invalid or expired token', undefined, { status: 401 });
    }

    // Get preferences
    const [preferencesRow] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, payload.userId))
      .limit(1);

    if (!preferencesRow) {
      return ok('No preferences found', null);
    }

    const preferences = mapDbPreferenceToData(preferencesRow);
    return ok('Preferences retrieved successfully', preferences);
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return fail(ERROR_CODES.internal_error, 'Failed to retrieve preferences', undefined, { status: 500 });
  }
}

/**
 * POST /api/user/preferences
 * Create new preferences for the user
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Authenticate user
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return fail(ERROR_CODES.unauthorized, 'Authentication required', undefined, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return fail(ERROR_CODES.invalid_token, 'Invalid or expired token', undefined, { status: 401 });
    }

    // Parse and validate body
    const body = await request.json().catch(() => ({}));
    const parsed = userPreferencesSchema.safeParse(body);

    if (!parsed.success) {
      return fail(
        ERROR_CODES.validation_error,
        'Invalid preferences data',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    // Check if preferences already exist
    const [existing] = await db
      .select({ id: userPreferences.id })
      .from(userPreferences)
      .where(eq(userPreferences.userId, payload.userId))
      .limit(1);

    if (existing) {
      return fail(
        ERROR_CODES.conflict,
        'Preferences already exist. Use PUT to update.',
        undefined,
        { status: 409 }
      );
    }

    // Prepare data for insert
    const data = parsed.data;
    const insertData = {
      userId: payload.userId,
      budgetMin: data.budgetMin ?? null,
      budgetMax: data.budgetMax ?? null,
      preferredCities: data.preferredCities ? JSON.stringify(data.preferredCities) : null,
      preferredLatitude: data.preferredLatitude ?? null,
      preferredLongitude: data.preferredLongitude ?? null,
      maxDistanceKm: data.maxDistanceKm?.toString() ?? null,
      requiredFacilities: data.requiredFacilities ? JSON.stringify(data.requiredFacilities) : null,
      optionalFacilities: data.optionalFacilities ? JSON.stringify(data.optionalFacilities) : null,
      roomType: data.roomType ?? 'any',
      minRating: data.minRating?.toString() ?? '3.0',
      needsAvailableRoom: data.needsAvailableRoom ?? true,
      weightPrice: data.weightPrice ?? 30,
      weightLocation: data.weightLocation ?? 25,
      weightFacilities: data.weightFacilities ?? 25,
      weightRating: data.weightRating ?? 20,
    };

    // Insert preferences
    const [newPreferences] = await db
      .insert(userPreferences)
      .values(insertData)
      .returning();

    const result = mapDbPreferenceToData(newPreferences);
    return ok('Preferences created successfully', result);
  } catch (error) {
    console.error('Error creating preferences:', error);
    return fail(ERROR_CODES.internal_error, 'Failed to create preferences', undefined, { status: 500 });
  }
}

/**
 * PUT /api/user/preferences
 * Update existing preferences (or create if not exists)
 */
export async function PUT(request: Request): Promise<Response> {
  try {
    // Authenticate user
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return fail(ERROR_CODES.unauthorized, 'Authentication required', undefined, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return fail(ERROR_CODES.invalid_token, 'Invalid or expired token', undefined, { status: 401 });
    }

    // Parse and validate body
    const body = await request.json().catch(() => ({}));
    const parsed = userPreferencesUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return fail(
        ERROR_CODES.validation_error,
        'Invalid preferences data',
        parsed.error.flatten(),
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if preferences exist
    const [existing] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, payload.userId))
      .limit(1);

    if (!existing) {
      // Create new preferences with defaults + provided data
      const insertData = {
        userId: payload.userId,
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        preferredCities: data.preferredCities ? JSON.stringify(data.preferredCities) : null,
        preferredLatitude: data.preferredLatitude ?? null,
        preferredLongitude: data.preferredLongitude ?? null,
        maxDistanceKm: data.maxDistanceKm?.toString() ?? null,
        requiredFacilities: data.requiredFacilities ? JSON.stringify(data.requiredFacilities) : null,
        optionalFacilities: data.optionalFacilities ? JSON.stringify(data.optionalFacilities) : null,
        roomType: data.roomType ?? 'any',
        minRating: data.minRating?.toString() ?? '3.0',
        needsAvailableRoom: data.needsAvailableRoom ?? true,
        weightPrice: data.weightPrice ?? 30,
        weightLocation: data.weightLocation ?? 25,
        weightFacilities: data.weightFacilities ?? 25,
        weightRating: data.weightRating ?? 20,
      };

      const [newPreferences] = await db
        .insert(userPreferences)
        .values(insertData)
        .returning();

      const result = mapDbPreferenceToData(newPreferences);
      return ok('Preferences created successfully', result);
    }

    // Build update object only with provided fields
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.budgetMin !== undefined) updateData.budgetMin = data.budgetMin;
    if (data.budgetMax !== undefined) updateData.budgetMax = data.budgetMax;
    if (data.preferredCities !== undefined) updateData.preferredCities = JSON.stringify(data.preferredCities);
    if (data.preferredLatitude !== undefined) updateData.preferredLatitude = data.preferredLatitude;
    if (data.preferredLongitude !== undefined) updateData.preferredLongitude = data.preferredLongitude;
    if (data.maxDistanceKm !== undefined) updateData.maxDistanceKm = data.maxDistanceKm?.toString() ?? null;
    if (data.requiredFacilities !== undefined) updateData.requiredFacilities = JSON.stringify(data.requiredFacilities);
    if (data.optionalFacilities !== undefined) updateData.optionalFacilities = JSON.stringify(data.optionalFacilities);
    if (data.roomType !== undefined) updateData.roomType = data.roomType;
    if (data.minRating !== undefined) updateData.minRating = data.minRating?.toString();
    if (data.needsAvailableRoom !== undefined) updateData.needsAvailableRoom = data.needsAvailableRoom;
    if (data.weightPrice !== undefined) updateData.weightPrice = data.weightPrice;
    if (data.weightLocation !== undefined) updateData.weightLocation = data.weightLocation;
    if (data.weightFacilities !== undefined) updateData.weightFacilities = data.weightFacilities;
    if (data.weightRating !== undefined) updateData.weightRating = data.weightRating;

    // Update preferences
    const [updated] = await db
      .update(userPreferences)
      .set(updateData)
      .where(eq(userPreferences.userId, payload.userId))
      .returning();

    const result = mapDbPreferenceToData(updated);
    return ok('Preferences updated successfully', result);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return fail(ERROR_CODES.internal_error, 'Failed to update preferences', undefined, { status: 500 });
  }
}

/**
 * DELETE /api/user/preferences
 * Delete user preferences (reset to default)
 */
export async function DELETE(request: Request): Promise<Response> {
  try {
    // Authenticate user
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return fail(ERROR_CODES.unauthorized, 'Authentication required', undefined, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return fail(ERROR_CODES.invalid_token, 'Invalid or expired token', undefined, { status: 401 });
    }

    // Delete preferences
    const result = await db
      .delete(userPreferences)
      .where(eq(userPreferences.userId, payload.userId))
      .returning({ id: userPreferences.id });

    if (result.length === 0) {
      return fail(ERROR_CODES.not_found, 'Preferences not found', undefined, { status: 404 });
    }

    return ok('Preferences deleted successfully', { deleted: true });
  } catch (error) {
    console.error('Error deleting preferences:', error);
    return fail(ERROR_CODES.internal_error, 'Failed to delete preferences', undefined, { status: 500 });
  }
}
