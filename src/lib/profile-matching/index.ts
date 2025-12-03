/**
 * Profile Matching Module
 * 
 * Exports all profile matching functionality for use throughout the application.
 */

// Scoring functions
export {
  calculatePriceScore,
  calculateLocationScore,
  calculateFacilitiesScore,
  calculateRatingScore,
  calculateAvailabilityScore,
  calculateMatchingScore,
  calculateDistance,
  parseFacilities,
} from './scoring';

// Main algorithm
export {
  getProfileMatchingRecommendations,
  getKosMatchingScore,
  mapDbPreferenceToData,
} from './algorithm';

// Re-export types for convenience
export type {
  UserPreferencesData,
  UserPreferencesInput,
  UserPreferencesUpdateInput,
  KosMatchingResult,
  MatchingScoreDetails,
  ProfileMatchingResponse,
} from '@/types/profile-matching';
