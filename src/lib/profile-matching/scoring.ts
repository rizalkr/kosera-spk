/**
 * Profile Matching Scoring Functions
 * 
 * Core scoring algorithms for the Profile Matching SPK system.
 * Each function calculates a score (1.0 - 5.0) for a specific criteria.
 */

import type { UserPreferencesData, MatchingScoreDetails } from '@/types/profile-matching';

// ============================================================
// PRICE SCORING
// ============================================================

/**
 * Calculate price matching score based on budget range.
 * 
 * Scoring:
 * - In range: 5.0
 * - Below min (cheaper): 4.5
 * - Above max by <10%: 4.0
 * - Above max by 10-20%: 3.0
 * - Above max by 20-30%: 2.0
 * - Above max by >30%: 1.0
 * 
 * @param price - Actual kos price
 * @param budgetMin - User's minimum budget (nullable)
 * @param budgetMax - User's maximum budget (nullable)
 * @returns Score between 1.0 and 5.0
 */
export const calculatePriceScore = (
  price: number,
  budgetMin: number | null,
  budgetMax: number | null
): number => {
  // If no budget constraints, give neutral score
  if (budgetMin === null && budgetMax === null) {
    return 4.0;
  }

  // Only minimum budget set
  if (budgetMax === null) {
    if (price >= budgetMin!) {
      return 5.0; // Within acceptable range
    }
    return 4.5; // Below minimum (cheaper than expected)
  }

  // Only maximum budget set
  if (budgetMin === null) {
    if (price <= budgetMax) {
      return 5.0; // Within budget
    }
    // Calculate how much over budget
    const overagePercent = ((price - budgetMax) / budgetMax) * 100;
    if (overagePercent <= 10) return 4.0;
    if (overagePercent <= 20) return 3.0;
    if (overagePercent <= 30) return 2.0;
    return 1.0;
  }

  // Both min and max set
  if (price >= budgetMin && price <= budgetMax) {
    return 5.0; // Perfect match - within range
  }

  if (price < budgetMin) {
    return 4.5; // Below minimum (cheaper)
  }

  // Price is above maximum
  const overagePercent = ((price - budgetMax) / budgetMax) * 100;
  if (overagePercent <= 10) return 4.0;
  if (overagePercent <= 20) return 3.0;
  if (overagePercent <= 30) return 2.0;
  return 1.0;
};

// ============================================================
// LOCATION SCORING
// ============================================================

/**
 * Calculate Haversine distance between two coordinates.
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

/**
 * Calculate location matching score based on city preference or distance.
 * 
 * City-based scoring:
 * - City matches preference: 5.0
 * - City doesn't match: 1.0
 * 
 * Distance-based scoring (if coordinates available):
 * - 0-1 km: 5.0
 * - 1-3 km: 4.5
 * - 3-5 km: 4.0
 * - 5-10 km: 3.0
 * - 10-15 km: 2.0
 * - >15 km: 1.0
 * 
 * @param kosCity - Kos city
 * @param kosLat - Kos latitude (optional)
 * @param kosLng - Kos longitude (optional)
 * @param preferredCities - User's preferred cities
 * @param prefLat - User's preferred latitude (optional)
 * @param prefLng - User's preferred longitude (optional)
 * @param maxDistanceKm - User's maximum distance preference (optional)
 * @returns Object with score and optional distance
 */
export const calculateLocationScore = (
  kosCity: string,
  kosLat: number | null,
  kosLng: number | null,
  preferredCities: string[],
  prefLat: number | null,
  prefLng: number | null,
  maxDistanceKm: number | null
): { score: number; distance?: number } => {
  // If user has coordinate preference and kos has coordinates
  if (prefLat !== null && prefLng !== null && kosLat !== null && kosLng !== null) {
    const distance = calculateDistance(prefLat, prefLng, kosLat, kosLng);
    
    // If max distance set and exceeded, low score
    if (maxDistanceKm !== null && distance > maxDistanceKm) {
      return { score: 1.0, distance };
    }
    
    // Score based on distance
    let score: number;
    if (distance <= 1) score = 5.0;
    else if (distance <= 3) score = 4.5;
    else if (distance <= 5) score = 4.0;
    else if (distance <= 10) score = 3.0;
    else if (distance <= 15) score = 2.0;
    else score = 1.0;
    
    return { score, distance };
  }
  
  // City-based scoring
  if (preferredCities.length > 0) {
    const cityMatches = preferredCities.some(
      (city) => city.toLowerCase() === kosCity.toLowerCase()
    );
    return { score: cityMatches ? 5.0 : 1.0 };
  }
  
  // No location preference - neutral score
  return { score: 4.0 };
};

// ============================================================
// FACILITIES SCORING
// ============================================================

/**
 * Parse facilities string into array.
 * Handles comma-separated facilities string.
 * 
 * @param facilities - Facilities string (comma-separated)
 * @returns Array of facility names
 */
export const parseFacilities = (facilities: string | null): string[] => {
  if (!facilities) return [];
  return facilities
    .split(',')
    .map((f) => f.trim().toLowerCase())
    .filter((f) => f.length > 0);
};

/**
 * Calculate facilities matching score.
 * 
 * Base score from required facilities fulfillment:
 * Score = (Matched Required / Total Required) * 4 + 1
 * 
 * Bonus for optional facilities:
 * +0.25 per optional facility matched (max +1.0)
 * 
 * @param kosFacilities - Kos facilities string
 * @param requiredFacilities - User's required facilities
 * @param optionalFacilities - User's optional facilities
 * @returns Score between 1.0 and 5.0
 */
export const calculateFacilitiesScore = (
  kosFacilities: string | null,
  requiredFacilities: string[],
  optionalFacilities: string[]
): number => {
  // If user has no facility preferences, give neutral score
  if (requiredFacilities.length === 0 && optionalFacilities.length === 0) {
    return 4.0;
  }

  const kosFacilitiesList = parseFacilities(kosFacilities);
  
  // Calculate required facilities match
  let requiredMatched = 0;
  if (requiredFacilities.length > 0) {
    for (const required of requiredFacilities) {
      const normalizedRequired = required.toLowerCase();
      if (kosFacilitiesList.some((f) => f.includes(normalizedRequired) || normalizedRequired.includes(f))) {
        requiredMatched++;
      }
    }
  }
  
  // Base score from required facilities
  let baseScore: number;
  if (requiredFacilities.length === 0) {
    baseScore = 4.0; // No required facilities
  } else {
    const fulfillmentRatio = requiredMatched / requiredFacilities.length;
    baseScore = fulfillmentRatio * 4 + 1; // Range 1.0 - 5.0
  }
  
  // Bonus from optional facilities (max +1.0)
  let optionalBonus = 0;
  if (optionalFacilities.length > 0) {
    let optionalMatched = 0;
    for (const optional of optionalFacilities) {
      const normalizedOptional = optional.toLowerCase();
      if (kosFacilitiesList.some((f) => f.includes(normalizedOptional) || normalizedOptional.includes(f))) {
        optionalMatched++;
      }
    }
    optionalBonus = Math.min((optionalMatched / optionalFacilities.length), 1.0);
  }
  
  // Final score (capped at 5.0)
  return Math.min(baseScore + optionalBonus * 0.5, 5.0);
};

// ============================================================
// RATING SCORING
// ============================================================

/**
 * Calculate rating matching score.
 * 
 * Scoring based on how kos rating compares to minimum preference:
 * - Rating >= minRating + 0.5: 5.0
 * - Rating >= minRating: 4.5
 * - Rating >= minRating - 0.5: 3.5
 * - Rating >= minRating - 1.0: 2.5
 * - Rating < minRating - 1.0: 1.0
 * 
 * @param kosRating - Kos average rating
 * @param minRating - User's minimum rating preference
 * @returns Score between 1.0 and 5.0
 */
export const calculateRatingScore = (
  kosRating: number | string,
  minRating: number
): number => {
  const rating = typeof kosRating === 'string' ? parseFloat(kosRating) : kosRating;
  
  // If kos has no rating (0), give lower score
  if (rating === 0 || isNaN(rating)) {
    return 2.0;
  }
  
  const difference = rating - minRating;
  
  if (difference >= 0.5) return 5.0;
  if (difference >= 0) return 4.5;
  if (difference >= -0.5) return 3.5;
  if (difference >= -1.0) return 2.5;
  return 1.0;
};

// ============================================================
// AVAILABILITY SCORING
// ============================================================

/**
 * Calculate availability score.
 * 
 * @param totalRooms - Total rooms in kos
 * @param occupiedRooms - Number of occupied rooms
 * @param needsAvailable - User needs available room
 * @returns Score between 1.0 and 5.0
 */
export const calculateAvailabilityScore = (
  totalRooms: number,
  occupiedRooms: number | null,
  needsAvailable: boolean
): number => {
  const occupied = occupiedRooms ?? 0;
  const availableRooms = totalRooms - occupied;
  
  if (!needsAvailable) {
    return 4.0; // User doesn't care about availability
  }
  
  if (availableRooms <= 0) {
    return 1.0; // No available rooms
  }
  
  // More available rooms = higher score
  const availabilityRatio = availableRooms / totalRooms;
  if (availabilityRatio >= 0.5) return 5.0;
  if (availabilityRatio >= 0.3) return 4.5;
  if (availabilityRatio >= 0.1) return 4.0;
  return 3.5;
};

// ============================================================
// COMPOSITE SCORING
// ============================================================

/**
 * Calculate complete matching score for a kos.
 * 
 * Uses weighted scoring based on user preferences.
 * Also calculates core factor and secondary factor averages
 * for traditional profile matching methodology.
 * 
 * Core Factors: Price, Location, Rating
 * Secondary Factors: Facilities
 * 
 * @param kos - Kos data
 * @param preferences - User preferences
 * @returns Matching result with final score and details
 */
export interface KosDataForScoring {
  price: number;
  city: string;
  latitude: number | null;
  longitude: number | null;
  facilities: string | null;
  averageRating: string | number;
  totalRooms: number;
  occupiedRooms: number | null;
}

export const calculateMatchingScore = (
  kos: KosDataForScoring,
  preferences: UserPreferencesData
): { score: number; details: MatchingScoreDetails; distance?: number } => {
  // Calculate individual scores
  const priceScore = calculatePriceScore(
    kos.price,
    preferences.budgetMin,
    preferences.budgetMax
  );
  
  const locationResult = calculateLocationScore(
    kos.city,
    kos.latitude,
    kos.longitude,
    preferences.preferredCities,
    preferences.preferredLatitude,
    preferences.preferredLongitude,
    preferences.maxDistanceKm
  );
  
  const facilitiesScore = calculateFacilitiesScore(
    kos.facilities,
    preferences.requiredFacilities,
    preferences.optionalFacilities
  );
  
  const ratingScore = calculateRatingScore(
    kos.averageRating,
    preferences.minRating
  );
  
  // Core Factor Average (Price, Location, Rating)
  const coreFactorAvg = (priceScore + locationResult.score + ratingScore) / 3;
  
  // Secondary Factor Average (Facilities)
  const secondaryFactorAvg = facilitiesScore;
  
  // Calculate weighted score using user's custom weights
  const totalWeight = 
    preferences.weightPrice + 
    preferences.weightLocation + 
    preferences.weightFacilities + 
    preferences.weightRating;
  
  const weightedScore = (
    (preferences.weightPrice / totalWeight) * priceScore +
    (preferences.weightLocation / totalWeight) * locationResult.score +
    (preferences.weightFacilities / totalWeight) * facilitiesScore +
    (preferences.weightRating / totalWeight) * ratingScore
  );
  
  return {
    score: Math.round(weightedScore * 100) / 100, // Round to 2 decimal places
    details: {
      priceScore: Math.round(priceScore * 100) / 100,
      locationScore: Math.round(locationResult.score * 100) / 100,
      facilitiesScore: Math.round(facilitiesScore * 100) / 100,
      ratingScore: Math.round(ratingScore * 100) / 100,
      coreFactorAvg: Math.round(coreFactorAvg * 100) / 100,
      secondaryFactorAvg: Math.round(secondaryFactorAvg * 100) / 100,
    },
    distance: locationResult.distance,
  };
};
