import { createAuthHeaders } from './utils';
import type { ApiResponse, AdminKosData, SearchParams, KosSearchApiResponse, PublicKosData, KosPhotosApiResponse, KosDetailData } from '@/types';
import { z } from 'zod';
import { apiClient } from '@/lib/api/client';

// ================= Zod Schemas (Create Kos) =================
export const createKosRequestSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  price: z.number().positive('Harga harus lebih besar dari 0'),
  name: z.string().min(1, 'Nama kos wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  facilities: z.string().min(1, 'Fasilitas wajib diisi'),
  totalRooms: z.number().positive('Total kamar harus > 0'),
  occupiedRooms: z.number().optional(),
});

export const createKosResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.object({ id: z.number().optional() }).partial().optional(),
  error: z.string().optional(),
}).passthrough();

export type CreateKosRequest = z.infer<typeof createKosRequestSchema>;
export type CreateKosResponse = z.infer<typeof createKosResponseSchema>;

/**
 * Create a new kos resource with runtime validation.
 * Uses the shared apiClient + Zod schema to ensure type-safe responses.
 */
export const createKos = async (payload: CreateKosRequest): Promise<CreateKosResponse> => {
  console.debug('[kosApi] createKos - request payload', payload);
  const response = await apiClient.postValidated<CreateKosResponse>('/api/kos', createKosResponseSchema, payload);
  console.debug('[kosApi] createKos - raw response', response);
  return response;
};

export const kosApi = {
  getFeatured: async (): Promise<ApiResponse<PublicKosData[]>> => {
    return apiClient.get('/api/kos/featured');
  },
  getRecommendations: async (params: SearchParams = {}): Promise<KosSearchApiResponse> => {
    return apiClient.get(`/api/kos/recommendations`, params as Record<string, unknown>);
  },
  search: async (params: SearchParams = {}): Promise<KosSearchApiResponse> => {
    return apiClient.get(`/api/kos/search`, params as Record<string, unknown>);
  },
  getNearby: async (lat: number, lng: number, radius = 5): Promise<KosSearchApiResponse> => {
    return apiClient.get(`/api/kos/nearby`, { latitude: lat, longitude: lng, radius });
  },
  getDetails: async (id: number): Promise<ApiResponse<KosDetailData>> => {
    return apiClient.get<ApiResponse<KosDetailData>>(`/api/kos/${id}`);
  },
  getMyKos: async (): Promise<ApiResponse<AdminKosData[]>> => {
    return apiClient.get(`/api/kos/my`, undefined, { headers: createAuthHeaders() });
  },
  trackView: async (id: number) => {
    return apiClient.post(`/api/kos/${id}/view`, undefined, { headers: createAuthHeaders() });
  },
  getPhotos: async (id: number): Promise<KosPhotosApiResponse> => {
    return apiClient.get<KosPhotosApiResponse>(`/api/kos/${id}/photos`);
  },
};