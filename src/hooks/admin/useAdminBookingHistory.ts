'use client';

import { useCallback, useState } from 'react';
import { adminBookingsApi } from '@/lib/api/admin-bookings';
import type { AdminBookingHistoryItem, AdminBookingHistoryResponse, ApiResponse } from '@/types';
import { ApiError } from '@/lib/api/client';

interface UseAdminBookingHistoryResult {
  data: AdminBookingHistoryItem[];
  loading: boolean;
  error: string | null;
  fetch: (bookingId: number) => Promise<void>;
  reset: () => void;
}

export const useAdminBookingHistory = (): UseAdminBookingHistoryResult => {
  const [data, setData] = useState<AdminBookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (bookingId: number) => {
    setLoading(true);
    setError(null);
    try {
  const res: ApiResponse<AdminBookingHistoryResponse> = await adminBookingsApi.getBookingHistory(bookingId);
      if (!res.success) {
        throw new Error(res.error || 'Failed to fetch booking history');
      }
      setData(res.data?.items ?? []);
    } catch (err) {
      const message = err instanceof ApiError
        ? `${err.message} (Status: ${err.status})`
        : err instanceof Error
        ? err.message
        : 'Failed to fetch booking history';
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, fetch, reset };
};
