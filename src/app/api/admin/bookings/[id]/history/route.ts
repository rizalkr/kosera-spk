import { requireAdmin } from '@/lib/server-auth';
import type { ServerAuthResult } from '@/lib/server-auth';
import { db } from '@/db';
import { bookingStatusHistory, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ok, fail } from '@/types/api';

/**
 * GET /api/admin/bookings/[id]/history
 * Returns chronological booking status change history for a booking
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const auth: ServerAuthResult = requireAdmin(_req);
  if (!auth.isAuthenticated) {
    return fail('unauthorized', `Unauthorized - ${auth.error}`, undefined, { status: 401 });
  }

  const bookingId = Number(id);
  if (isNaN(bookingId)) {
    return fail('invalid_id', 'Invalid booking ID', undefined, { status: 400 });
  }

  try {
    const rows = await db
      .select({
        id: bookingStatusHistory.id,
        previousStatus: bookingStatusHistory.previousStatus,
        newStatus: bookingStatusHistory.newStatus,
        notes: bookingStatusHistory.notes,
        createdAt: bookingStatusHistory.createdAt,
        adminId: bookingStatusHistory.adminId,
        adminName: users.name,
        adminUsername: users.username,
      })
      .from(bookingStatusHistory)
      .leftJoin(users, eq(users.id, bookingStatusHistory.adminId))
      .where(eq(bookingStatusHistory.bookingId, bookingId))
      .orderBy(bookingStatusHistory.createdAt);

    const items = rows.map((r) => ({
      id: r.id,
      previousStatus: r.previousStatus,
      newStatus: r.newStatus,
      notes: r.notes ?? undefined,
      createdAt: r.createdAt?.toISOString?.() ?? new Date(r.createdAt as unknown as string).toISOString(),
      changedBy: r.adminId
        ? { id: r.adminId, name: r.adminName ?? '', username: r.adminUsername ?? '' }
        : null,
    }));

    return ok('Booking history fetched', { items });
  } catch (error) {
    console.error('Admin get booking history error:', error);
    return fail('internal_error', 'Failed to fetch booking history', undefined, { status: 500 });
  }
}
