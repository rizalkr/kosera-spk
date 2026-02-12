import { z } from 'zod';

/**
 * Profile Matching SPK Types
 * Types and schemas for the profile matching recommendation system
 */

// ============================================================
// CONSTANTS
// ============================================================

/**
 * Available facilities in the system
 */
export const AVAILABLE_FACILITIES = [
  'AC',
  'WiFi',
  'Kamar Mandi Dalam',
  'Kamar Mandi Luar',
  'Dapur Bersama',
  'Dapur Pribadi',
  'Parkir Motor',
  'Parkir Mobil',
  'Laundry',
  'Security 24 Jam',
  'TV',
  'Kasur Queen',
  'Kasur Single',
  'Lemari',
  'Meja Belajar',
  'Balkon',
  'Gym',
  'Rooftop',
] as const;

export type AvailableFacility = typeof AVAILABLE_FACILITIES[number];

/**
 * Available kecamatan/cities in the system (Semarang area)
 * Now uses Kecamatan instead of city names for more granular filtering
 */
export const AVAILABLE_CITIES = [
  'Banyumanik',
  'Candisari',
  'Gajah Mungkur',
  'Gayamsari',
  'Genuk',
  'Gunungpati',
  'Mijen',
  'Ngaliyan',
  'Pedurungan',
  'Semarang Barat',
  'Semarang Selatan',
  'Semarang Tengah',
  'Semarang Timur',
  'Semarang Utara',
  'Tembalang',
  'Tugu',
] as const;

export type AvailableCity = typeof AVAILABLE_CITIES[number];

/**
 * Room type options
 */
export const ROOM_TYPES = ['single', 'shared', 'any'] as const;
export type RoomType = typeof ROOM_TYPES[number];

// ============================================================
// ZOD SCHEMAS
// ============================================================

/**
 * Base schema for user preferences (without refinements)
 */
const userPreferencesBaseSchema = z.object({
  // Budget Preferences
  budgetMin: z.number().int().min(0).nullable().optional(),
  budgetMax: z.number().int().min(0).nullable().optional(),
  
  // Location Preferences
  preferredCities: z.array(z.string()).optional(),
  preferredLatitude: z.number().min(-90).max(90).nullable().optional(),
  preferredLongitude: z.number().min(-180).max(180).nullable().optional(),
  maxDistanceKm: z.number().min(0).max(100).nullable().optional(),
  
  // Facilities Preferences
  requiredFacilities: z.array(z.string()).optional(),
  optionalFacilities: z.array(z.string()).optional(),
  
  // Room Preferences
  roomType: z.enum(ROOM_TYPES).optional().default('any'),
  
  // Quality Preferences
  minRating: z.number().min(1).max(5).optional().default(3.0),
  
  // Availability
  needsAvailableRoom: z.boolean().optional().default(true),
  
  // Weights (must sum to 100)
  weightPrice: z.number().int().min(0).max(100).optional().default(30),
  weightLocation: z.number().int().min(0).max(100).optional().default(25),
  weightFacilities: z.number().int().min(0).max(100).optional().default(25),
  weightRating: z.number().int().min(0).max(100).optional().default(20),
});

/**
 * Schema for validating user preferences input with refinements
 */
export const userPreferencesSchema = userPreferencesBaseSchema.refine(
  (data) => {
    const total = (data.weightPrice ?? 30) + 
                  (data.weightLocation ?? 25) + 
                  (data.weightFacilities ?? 25) + 
                  (data.weightRating ?? 20);
    return total === 100;
  },
  { message: 'Weights must sum to 100' }
).refine(
  (data) => {
    if (data.budgetMin !== null && data.budgetMin !== undefined && 
        data.budgetMax !== null && data.budgetMax !== undefined) {
      return data.budgetMin <= data.budgetMax;
    }
    return true;
  },
  { message: 'budgetMin must be less than or equal to budgetMax' }
);

/**
 * Schema for partial update of preferences (without refinements for flexibility)
 */
export const userPreferencesUpdateSchema = userPreferencesBaseSchema.partial();

// ============================================================
// TYPESCRIPT INTERFACES
// ============================================================

/**
 * User preferences stored in database
 */
export interface UserPreferencesData {
  id: number;
  userId: number;
  budgetMin: number | null;
  budgetMax: number | null;
  preferredCities: string[];
  preferredLatitude: number | null;
  preferredLongitude: number | null;
  maxDistanceKm: number | null;
  requiredFacilities: string[];
  optionalFacilities: string[];
  roomType: RoomType;
  minRating: number;
  needsAvailableRoom: boolean;
  weightPrice: number;
  weightLocation: number;
  weightFacilities: number;
  weightRating: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating/updating preferences
 */
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type UserPreferencesUpdateInput = z.infer<typeof userPreferencesUpdateSchema>;

/**
 * Matching score details for a single kos
 */
export interface MatchingScoreDetails {
  priceScore: number;
  locationScore: number;
  facilitiesScore: number;
  ratingScore: number;
  coreFactorAvg: number;
  secondaryFactorAvg: number;
}

/**
 * Complete matching result for a kos
 */
export interface KosMatchingResult {
  id: number;
  postId: number;
  name: string;
  address: string;
  city: string;
  facilities: string | null;
  latitude: number | null;
  longitude: number | null;
  totalRooms: number;
  occupiedRooms: number | null;
  availableRooms: number;
  
  // Post data
  title: string;
  description: string;
  price: number;
  averageRating: string;
  reviewCount: number;
  viewCount: number;
  favoriteCount: number;
  photoCount: number;
  isFeatured: boolean;
  
  // Owner info
  owner: {
    id: number;
    name: string;
    username: string;
    contact: string;
  };
  
  // Photos
  photos: Array<{
    id: number;
    url: string;
    isPrimary: boolean;
  }>;
  
  // Matching scores
  matchingScore: number;
  matchingDetails: MatchingScoreDetails;
  
  // Distance (if location preference provided)
  distance?: number;
}

/**
 * Profile matching API response
 */
export interface ProfileMatchingResponse {
  recommendations: KosMatchingResult[];
  userPreferences: UserPreferencesData | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Gap conversion table for profile matching algorithm
 */
export interface GapConversion {
  gap: number;
  weight: number;
  description: string;
}

/**
 * Profile matching configuration
 */
export interface ProfileMatchingConfig {
  coreFactorWeight: number;     // Default: 0.6 (60%)
  secondaryFactorWeight: number; // Default: 0.4 (40%)
  gapConversionTable: GapConversion[];
}

/**
 * Default gap conversion table based on profile matching methodology
 */
export const DEFAULT_GAP_CONVERSION: GapConversion[] = [
  { gap: 0, weight: 5.0, description: 'Tidak ada gap (ideal)' },
  { gap: 1, weight: 4.5, description: 'Kelebihan 1 tingkat' },
  { gap: -1, weight: 4.0, description: 'Kekurangan 1 tingkat' },
  { gap: 2, weight: 3.5, description: 'Kelebihan 2 tingkat' },
  { gap: -2, weight: 3.0, description: 'Kekurangan 2 tingkat' },
  { gap: 3, weight: 2.5, description: 'Kelebihan 3 tingkat' },
  { gap: -3, weight: 2.0, description: 'Kekurangan 3 tingkat' },
  { gap: 4, weight: 1.5, description: 'Kelebihan 4 tingkat' },
  { gap: -4, weight: 1.0, description: 'Kekurangan 4 tingkat' },
];

/**
 * Default profile matching configuration
 */
export const DEFAULT_PROFILE_MATCHING_CONFIG: ProfileMatchingConfig = {
  coreFactorWeight: 0.6,
  secondaryFactorWeight: 0.4,
  gapConversionTable: DEFAULT_GAP_CONVERSION,
};
