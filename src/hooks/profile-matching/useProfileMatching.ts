import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { 
  UserPreferencesData, 
  UserPreferencesInput,
  UserPreferencesUpdateInput,
  ProfileMatchingResponse 
} from '@/types/profile-matching';
import type { ApiResponse } from '@/types';

// ============================================================
// API FUNCTIONS
// ============================================================

const preferencesApi = {
  /**
   * Get current user's preferences
   */
  getPreferences: async (): Promise<ApiResponse<UserPreferencesData | null>> => {
    return apiClient.get('/api/user/preferences');
  },

  /**
   * Create new preferences
   */
  createPreferences: async (data: UserPreferencesInput): Promise<ApiResponse<UserPreferencesData>> => {
    return apiClient.post('/api/user/preferences', data);
  },

  /**
   * Update existing preferences
   */
  updatePreferences: async (data: UserPreferencesUpdateInput): Promise<ApiResponse<UserPreferencesData>> => {
    return apiClient.put('/api/user/preferences', data);
  },

  /**
   * Delete preferences (reset to default)
   */
  deletePreferences: async (): Promise<ApiResponse<{ deleted: boolean }>> => {
    return apiClient.delete('/api/user/preferences');
  },

  /**
   * Get profile matching recommendations
   */
  getProfileMatching: async (params: {
    page?: number;
    limit?: number;
    minScore?: number;
    latitude?: number;
    longitude?: number;
  } = {}): Promise<ApiResponse<ProfileMatchingResponse>> => {
    const queryParams: Record<string, string> = {};
    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);
    if (params.minScore) queryParams.min_score = String(params.minScore);
    if (params.latitude) queryParams.latitude = String(params.latitude);
    if (params.longitude) queryParams.longitude = String(params.longitude);
    
    return apiClient.get('/api/kos/profile-matching', queryParams);
  },
};

// ============================================================
// QUERY KEYS
// ============================================================

export const profileMatchingKeys = {
  all: ['profile-matching'] as const,
  preferences: () => [...profileMatchingKeys.all, 'preferences'] as const,
  recommendations: (params?: { page?: number; limit?: number; minScore?: number; latitude?: number; longitude?: number }) =>
    [...profileMatchingKeys.all, 'recommendations', params] as const,
};

// ============================================================
// HOOKS
// ============================================================

/**
 * Hook to get user preferences
 */
export const useUserPreferences = () => {
  return useQuery({
    queryKey: profileMatchingKeys.preferences(),
    queryFn: preferencesApi.getPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create preferences
 */
export const useCreatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preferencesApi.createPreferences,
    onSuccess: () => {
      // Invalidate preferences and recommendations
      queryClient.invalidateQueries({ queryKey: profileMatchingKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: profileMatchingKeys.all });
    },
  });
};

/**
 * Hook to update preferences
 */
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preferencesApi.updatePreferences,
    onSuccess: () => {
      // Invalidate preferences and recommendations
      queryClient.invalidateQueries({ queryKey: profileMatchingKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: profileMatchingKeys.all });
    },
  });
};

/**
 * Hook to delete preferences
 */
export const useDeletePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preferencesApi.deletePreferences,
    onSuccess: () => {
      // Invalidate preferences and recommendations
      queryClient.invalidateQueries({ queryKey: profileMatchingKeys.preferences() });
      queryClient.invalidateQueries({ queryKey: profileMatchingKeys.all });
    },
  });
};

/**
 * Hook to get profile matching recommendations
 * Supports geolocation fallback via latitude/longitude params
 */
export const useProfileMatching = (params: {
  page?: number;
  limit?: number;
  minScore?: number;
  latitude?: number;
  longitude?: number;
} = {}) => {
  return useQuery({
    queryKey: profileMatchingKeys.recommendations(params),
    queryFn: () => preferencesApi.getProfileMatching(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Combined hook for managing preferences (get + update)
 */
export const usePreferencesManager = () => {
  const preferences = useUserPreferences();
  const createMutation = useCreatePreferences();
  const updateMutation = useUpdatePreferences();
  const deleteMutation = useDeletePreferences();

  const savePreferences = async (data: UserPreferencesInput) => {
    // If preferences exist, update; otherwise create
    if (preferences.data?.data) {
      return updateMutation.mutateAsync(data);
    }
    return createMutation.mutateAsync(data);
  };

  return {
    preferences: preferences.data?.data ?? null,
    isLoading: preferences.isLoading,
    error: preferences.error,
    savePreferences,
    deletePreferences: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
