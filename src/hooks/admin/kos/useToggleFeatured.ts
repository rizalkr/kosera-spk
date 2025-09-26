import { useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { adminApi } from "@/lib/api";

export const useToggleFeatured = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const toggleFeatured = async (kosId: number, isFeatured: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.toggleFeatured(kosId, isFeatured);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update featured status');
      }
      // Invalidate caches so UI refreshes
      queryClient.invalidateQueries({ queryKey: ['kos', 'featured'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'kos'] });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleFeatured, loading, error };
};