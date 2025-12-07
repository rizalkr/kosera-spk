/**
 * Unit Tests for Profile Matching SPK Algorithm
 *
 * Tests the scoring functions based on Kusrini (2007) Profile Matching methodology.
 * Covers GAP calculation, level mapping, and composite score calculation.
 *
 * NOTE: This is a pure unit test - no database connection required.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock database to skip database reset for pure unit tests
vi.mock('@/db', () => ({
  db: {},
}));

// Skip database reset for this unit test file
beforeAll(() => {
  vi.stubEnv('SKIP_DB_RESET', '1');
});

import {
  convertGapToWeight,
  getPriceLevel,
  getDistanceLevel,
  getRatingLevel,
  getFacilitiesLevel,
  calculatePriceScore,
  calculateLocationScore,
  calculateFacilitiesScore,
  calculateRatingScore,
  calculateDistance,
  calculateMatchingScore,
  parseFacilities,
  CORE_FACTOR_PERCENTAGE,
  SECONDARY_FACTOR_PERCENTAGE,
} from '@/lib/profile-matching/scoring';
import type { UserPreferencesData } from '@/types/profile-matching';

// ============================================================
// GAP TO WEIGHT CONVERSION TESTS
// ============================================================

describe('convertGapToWeight', () => {
  it('should return 5.0 for GAP 0 (ideal match)', () => {
    expect(convertGapToWeight(0)).toBe(5.0);
  });

  it('should return 4.5 for GAP +1 (slightly over)', () => {
    expect(convertGapToWeight(1)).toBe(4.5);
  });

  it('should return 4.0 for GAP -1 (slightly under)', () => {
    expect(convertGapToWeight(-1)).toBe(4.0);
  });

  it('should return correct weights for all GAP values', () => {
    expect(convertGapToWeight(2)).toBe(3.5);
    expect(convertGapToWeight(-2)).toBe(3.0);
    expect(convertGapToWeight(3)).toBe(2.5);
    expect(convertGapToWeight(-3)).toBe(2.0);
    expect(convertGapToWeight(4)).toBe(1.5);
    expect(convertGapToWeight(-4)).toBe(1.0);
  });

  it('should clamp extreme positive GAP values to GAP 4 (returns 1.5)', () => {
    // GAP > 4 gets clamped to 4, which returns 1.5 per Kusrini table
    expect(convertGapToWeight(5)).toBe(1.5);
    expect(convertGapToWeight(100)).toBe(1.5);
  });

  it('should clamp extreme negative GAP values to GAP -4 (returns 1.0)', () => {
    // GAP < -4 gets clamped to -4, which returns 1.0 per Kusrini table
    expect(convertGapToWeight(-5)).toBe(1.0);
    expect(convertGapToWeight(-100)).toBe(1.0);
  });
});

// ============================================================
// LEVEL MAPPING TESTS
// ============================================================

describe('getPriceLevel', () => {
  it('should return level 1 for prices <= 500.000', () => {
    expect(getPriceLevel(300000)).toBe(1);
    expect(getPriceLevel(500000)).toBe(1);
  });

  it('should return level 2 for prices 500.001 - 1.000.000', () => {
    expect(getPriceLevel(500001)).toBe(2);
    expect(getPriceLevel(800000)).toBe(2);
    expect(getPriceLevel(1000000)).toBe(2);
  });

  it('should return level 3 for prices 1.000.001 - 1.500.000', () => {
    expect(getPriceLevel(1000001)).toBe(3);
    expect(getPriceLevel(1200000)).toBe(3);
    expect(getPriceLevel(1500000)).toBe(3);
  });

  it('should return level 4 for prices 1.500.001 - 2.500.000', () => {
    expect(getPriceLevel(1500001)).toBe(4);
    expect(getPriceLevel(2000000)).toBe(4);
    expect(getPriceLevel(2500000)).toBe(4);
  });

  it('should return level 5 for prices > 2.500.000', () => {
    expect(getPriceLevel(2500001)).toBe(5);
    expect(getPriceLevel(5000000)).toBe(5);
  });
});

describe('getDistanceLevel', () => {
  it('should return level 5 for distances <= 1km (sangat dekat)', () => {
    expect(getDistanceLevel(0.5)).toBe(5);
    expect(getDistanceLevel(1)).toBe(5);
  });

  it('should return level 4 for distances 1-5km (dekat)', () => {
    expect(getDistanceLevel(1.1)).toBe(4);
    expect(getDistanceLevel(3)).toBe(4);
    expect(getDistanceLevel(5)).toBe(4);
  });

  it('should return level 3 for distances 5-10km (sedang)', () => {
    expect(getDistanceLevel(5.1)).toBe(3);
    expect(getDistanceLevel(7)).toBe(3);
    expect(getDistanceLevel(10)).toBe(3);
  });

  it('should return level 2 for distances 10-15km (jauh)', () => {
    expect(getDistanceLevel(10.1)).toBe(2);
    expect(getDistanceLevel(12)).toBe(2);
    expect(getDistanceLevel(15)).toBe(2);
  });

  it('should return level 1 for distances > 15km (sangat jauh)', () => {
    expect(getDistanceLevel(15.1)).toBe(1);
    expect(getDistanceLevel(20)).toBe(1);
    expect(getDistanceLevel(100)).toBe(1);
  });
});

describe('getRatingLevel', () => {
  it('should return 1 for no rating or invalid rating', () => {
    expect(getRatingLevel(0)).toBe(1);
    expect(getRatingLevel(NaN)).toBe(1);
    expect(getRatingLevel(-1)).toBe(1);
  });

  it('should round rating to nearest integer level', () => {
    expect(getRatingLevel(1.4)).toBe(1);
    expect(getRatingLevel(1.5)).toBe(2);
    expect(getRatingLevel(2.4)).toBe(2);
    expect(getRatingLevel(3.6)).toBe(4);
    expect(getRatingLevel(4.5)).toBe(5);
    expect(getRatingLevel(5.0)).toBe(5);
  });

  it('should clamp ratings above 5 to level 5', () => {
    expect(getRatingLevel(5.5)).toBe(5);
    expect(getRatingLevel(10)).toBe(5);
  });
});

describe('getFacilitiesLevel', () => {
  it('should return level 1 for 0-20% fulfillment', () => {
    expect(getFacilitiesLevel(0)).toBe(1);
    expect(getFacilitiesLevel(10)).toBe(1);
    expect(getFacilitiesLevel(20)).toBe(1);
  });

  it('should return level 2 for 21-40% fulfillment', () => {
    expect(getFacilitiesLevel(21)).toBe(2);
    expect(getFacilitiesLevel(30)).toBe(2);
    expect(getFacilitiesLevel(40)).toBe(2);
  });

  it('should return level 3 for 41-60% fulfillment', () => {
    expect(getFacilitiesLevel(41)).toBe(3);
    expect(getFacilitiesLevel(50)).toBe(3);
    expect(getFacilitiesLevel(60)).toBe(3);
  });

  it('should return level 4 for 61-80% fulfillment', () => {
    expect(getFacilitiesLevel(61)).toBe(4);
    expect(getFacilitiesLevel(70)).toBe(4);
    expect(getFacilitiesLevel(80)).toBe(4);
  });

  it('should return level 5 for 81-100% fulfillment', () => {
    expect(getFacilitiesLevel(81)).toBe(5);
    expect(getFacilitiesLevel(90)).toBe(5);
    expect(getFacilitiesLevel(100)).toBe(5);
  });
});

// ============================================================
// PRICE SCORING TESTS
// ============================================================

describe('calculatePriceScore', () => {
  it('should return ideal score (5.0) when no budget constraints', () => {
    const result = calculatePriceScore(1500000, null, null);
    expect(result.score).toBe(5.0);
    expect(result.gap).toBe(0);
  });

  it('should return ideal score (5.0) when price matches budget exactly', () => {
    // Budget 1.500.000 (Level 3), Kos 1.500.000 (Level 3) -> Gap 0
    const result = calculatePriceScore(1500000, null, 1500000);
    expect(result.score).toBe(5.0);
    expect(result.gap).toBe(0);
    expect(result.kosLevel).toBe(3);
    expect(result.userLevel).toBe(3);
  });

  it('should return ideal score (5.0) when price is CHEAPER than budget (PATCHED)', () => {
    // Budget 1.500.000 (Level 3), Kos 800.000 (Level 2)
    // Gap raw = 3 - 2 = 1, but patched to 0
    const result = calculatePriceScore(800000, null, 1500000);
    expect(result.score).toBe(5.0);
    expect(result.gap).toBe(0); // Patched: cheaper is ideal
  });

  it('should penalize when price exceeds budget by 1 level', () => {
    // Budget 1.500.000 (Level 3), Kos 2.000.000 (Level 4)
    // Gap = 3 - 4 = -1 -> Score 4.0
    const result = calculatePriceScore(2000000, null, 1500000);
    expect(result.score).toBe(4.0);
    expect(result.gap).toBe(-1);
  });

  it('should heavily penalize when price exceeds budget by 2 levels', () => {
    // Budget 1.000.000 (Level 2), Kos 2.000.000 (Level 4)
    // Gap = 2 - 4 = -2 -> Score 3.0
    const result = calculatePriceScore(2000000, null, 1000000);
    expect(result.score).toBe(3.0);
    expect(result.gap).toBe(-2);
  });

  it('should use budgetMin as target when budgetMax is null', () => {
    const result = calculatePriceScore(1500000, 1500000, null);
    expect(result.score).toBe(5.0);
  });
});

// ============================================================
// LOCATION SCORING TESTS
// ============================================================

describe('calculateDistance (Haversine)', () => {
  it('should return 0 for same coordinates', () => {
    const distance = calculateDistance(-6.2088, 106.8456, -6.2088, 106.8456);
    expect(distance).toBeCloseTo(0, 5);
  });

  it('should calculate correct distance between two points', () => {
    // Jakarta to Bandung approximately 120km
    const distance = calculateDistance(-6.2088, 106.8456, -6.9175, 107.6191);
    expect(distance).toBeGreaterThan(100);
    expect(distance).toBeLessThan(150);
  });
});

describe('calculateLocationScore', () => {
  it('should return ideal score (5.0) when no location preferences', () => {
    const result = calculateLocationScore('Jakarta', null, null, [], null, null, null);
    expect(result.score).toBe(5.0);
    expect(result.gap).toBe(0);
  });

  it('should return ideal score (5.0) when city matches preference', () => {
    const result = calculateLocationScore('Jakarta', null, null, ['Jakarta', 'Bandung'], null, null, null);
    expect(result.score).toBe(5.0);
    expect(result.kosLevel).toBe(5);
  });

  it('should return low score (1.0) when city does not match preference', () => {
    const result = calculateLocationScore('Surabaya', null, null, ['Jakarta', 'Bandung'], null, null, null);
    expect(result.score).toBe(1.0);
    expect(result.kosLevel).toBe(1);
  });

  it('should be case-insensitive for city matching', () => {
    const result = calculateLocationScore('jakarta', null, null, ['Jakarta'], null, null, null);
    expect(result.score).toBe(5.0);
  });

  it('should calculate score based on distance when coordinates provided', () => {
    // User at -6.2088, 106.8456, Kos at same location -> very close
    const result = calculateLocationScore(
      'Jakarta',
      -6.2088,
      106.8456,
      [],
      -6.2088,
      106.8456,
      null
    );
    expect(result.score).toBe(5.0);
    expect(result.distance).toBeCloseTo(0, 2);
  });

  it('should return low score when distance exceeds maxDistanceKm', () => {
    // User and kos are far apart, max distance is 5km
    const result = calculateLocationScore(
      'Jakarta',
      -6.9175, // Bandung
      107.6191,
      [],
      -6.2088, // Jakarta
      106.8456,
      5 // max 5km
    );
    expect(result.score).toBe(1.0);
    expect(result.distance).toBeGreaterThan(5);
  });
});

// ============================================================
// FACILITIES SCORING TESTS
// ============================================================

describe('parseFacilities', () => {
  it('should parse comma-separated facilities string', () => {
    const result = parseFacilities('WiFi, AC, Kamar Mandi Dalam');
    expect(result).toEqual(['wifi', 'ac', 'kamar mandi dalam']);
  });

  it('should return empty array for null or empty string', () => {
    expect(parseFacilities(null)).toEqual([]);
    expect(parseFacilities('')).toEqual([]);
  });

  it('should trim whitespace and convert to lowercase', () => {
    const result = parseFacilities('  WiFi  ,  AC  ');
    expect(result).toEqual(['wifi', 'ac']);
  });
});

describe('calculateFacilitiesScore', () => {
  it('should return ideal score (5.0) when no facility preferences', () => {
    const result = calculateFacilitiesScore('WiFi, AC', [], []);
    expect(result.score).toBe(5.0);
    expect(result.gap).toBe(0);
  });

  it('should return ideal score when all required facilities are present', () => {
    const result = calculateFacilitiesScore('WiFi, AC, Kamar Mandi Dalam', ['WiFi', 'AC'], []);
    expect(result.score).toBe(5.0);
    expect(result.matchedCount).toBe(2);
    expect(result.totalRequired).toBe(2);
  });

  it('should return low score when no required facilities are present', () => {
    const result = calculateFacilitiesScore('Parkir, Dapur', ['WiFi', 'AC'], []);
    expect(result.score).toBeLessThan(3.0);
    expect(result.matchedCount).toBe(0);
  });

  it('should return partial score when some required facilities are present', () => {
    const result = calculateFacilitiesScore('WiFi, Parkir', ['WiFi', 'AC'], []);
    expect(result.matchedCount).toBe(1);
    expect(result.totalRequired).toBe(2);
    // 50% fulfillment -> Level 3 -> Gap -2 -> Score 3.0
    expect(result.score).toBe(3.0);
  });

  it('should handle partial string matching for facilities', () => {
    // "kamar mandi" should match "Kamar Mandi Dalam"
    const result = calculateFacilitiesScore('Kamar Mandi Dalam, WiFi', ['kamar mandi', 'wifi'], []);
    expect(result.matchedCount).toBe(2);
  });
});

// ============================================================
// RATING SCORING TESTS
// ============================================================

describe('calculateRatingScore', () => {
  it('should return ideal score when rating meets minimum', () => {
    // Kos rating 4.0, User min 4.0 -> Gap 0 -> Score 5.0
    const result = calculateRatingScore(4.0, 4.0);
    expect(result.score).toBe(5.0);
    expect(result.gap).toBe(0);
  });

  it('should return ideal score when rating exceeds minimum', () => {
    // Kos rating 5.0 (Level 5), User min 4.0 (Level 4) -> Gap +1 -> Score 4.5
    const result = calculateRatingScore(5.0, 4.0);
    expect(result.score).toBe(4.5);
    expect(result.gap).toBe(1);
  });

  it('should penalize when rating is below minimum', () => {
    // Kos rating 3.0 (Level 3), User min 4.0 (Level 4) -> Gap -1 -> Score 4.0
    const result = calculateRatingScore(3.0, 4.0);
    expect(result.score).toBe(4.0);
    expect(result.gap).toBe(-1);
  });

  it('should handle string rating input', () => {
    const result = calculateRatingScore('4.5', 4.0);
    expect(result.kosLevel).toBe(5); // 4.5 rounds to 5
  });

  it('should return low score for kos with no rating', () => {
    const result = calculateRatingScore(0, 4.0);
    expect(result.kosLevel).toBe(1);
  });
});

// ============================================================
// COMPOSITE SCORING TESTS (PROFILE MATCHING FORMULA)
// ============================================================

describe('calculateMatchingScore', () => {
  const createMockPreferences = (overrides: Partial<UserPreferencesData> = {}): UserPreferencesData => ({
    id: 1,
    userId: 1,
    budgetMin: null,
    budgetMax: 1500000,
    preferredCities: ['Jakarta'],
    preferredLatitude: null,
    preferredLongitude: null,
    maxDistanceKm: null,
    requiredFacilities: ['WiFi', 'AC'],
    optionalFacilities: [],
    roomType: 'any',
    minRating: 4.0,
    needsAvailableRoom: true,
    weightPrice: 52,
    weightLocation: 27,
    weightFacilities: 15,
    weightRating: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  const createMockKos = (overrides: Partial<{
    price: number;
    city: string;
    latitude: number | null;
    longitude: number | null;
    facilities: string | null;
    averageRating: string | number;
    totalRooms: number;
    occupiedRooms: number | null;
  }> = {}) => ({
    price: 1500000,
    city: 'Jakarta',
    latitude: null,
    longitude: null,
    facilities: 'WiFi, AC, Kamar Mandi Dalam',
    averageRating: 4.5,
    totalRooms: 10,
    occupiedRooms: 5,
    ...overrides,
  });

  it('should return perfect score for ideal match', () => {
    const preferences = createMockPreferences();
    const kos = createMockKos();

    const result = calculateMatchingScore(kos, preferences);

    // All criteria should score 5.0
    expect(result.details.priceScore).toBe(5.0);
    expect(result.details.locationScore).toBe(5.0);
    expect(result.details.facilitiesScore).toBe(5.0);
    expect(result.details.ratingScore).toBeGreaterThanOrEqual(4.5);

    // NCF and NSF should be high
    expect(result.details.coreFactorAvg).toBeGreaterThan(4.5);
    expect(result.details.secondaryFactorAvg).toBe(5.0);

    // Final score should be close to 5.0
    expect(result.score).toBeGreaterThan(4.5);
  });

  it('should calculate correct NCF (Core Factor Average)', () => {
    const preferences = createMockPreferences();
    const kos = createMockKos();

    const result = calculateMatchingScore(kos, preferences);

    // NCF = (priceScore + locationScore + ratingScore) / 3
    const expectedNCF = (result.details.priceScore + result.details.locationScore + result.details.ratingScore) / 3;
    expect(result.details.coreFactorAvg).toBeCloseTo(expectedNCF, 2);
  });

  it('should calculate correct NSF (Secondary Factor Average)', () => {
    const preferences = createMockPreferences();
    const kos = createMockKos();

    const result = calculateMatchingScore(kos, preferences);

    // NSF = facilitiesScore (only one secondary factor)
    expect(result.details.secondaryFactorAvg).toBe(result.details.facilitiesScore);
  });

  it('should apply Profile Matching formula: (60% NCF) + (40% NSF)', () => {
    const preferences = createMockPreferences();
    const kos = createMockKos();

    const result = calculateMatchingScore(kos, preferences);

    const expectedScore = (CORE_FACTOR_PERCENTAGE * result.details.coreFactorAvg) + 
                         (SECONDARY_FACTOR_PERCENTAGE * result.details.secondaryFactorAvg);
    
    expect(result.score).toBeCloseTo(expectedScore, 2);
  });

  it('should penalize when price exceeds budget', () => {
    const preferences = createMockPreferences({ budgetMax: 1000000 });
    const kos = createMockKos({ price: 2000000 }); // Way over budget

    const result = calculateMatchingScore(kos, preferences);

    // Price exceeds budget by ~2 levels, should get penalized price score
    expect(result.details.priceScore).toBeLessThan(5.0);
    // Overall score should be less than perfect but still reasonable due to other factors
    expect(result.score).toBeLessThanOrEqual(4.5);
  });

  it('should penalize when city does not match', () => {
    const preferences = createMockPreferences({ preferredCities: ['Bandung'] });
    const kos = createMockKos({ city: 'Jakarta' });

    const result = calculateMatchingScore(kos, preferences);

    expect(result.details.locationScore).toBe(1.0);
    // Score should be lower but not drastically due to other factors being ideal
    expect(result.score).toBeLessThan(4.5);
  });

  it('should penalize when required facilities are missing', () => {
    const preferences = createMockPreferences({ requiredFacilities: ['WiFi', 'AC', 'Kolam Renang'] });
    const kos = createMockKos({ facilities: 'WiFi' }); // Missing AC and Kolam Renang

    const result = calculateMatchingScore(kos, preferences);

    expect(result.details.facilitiesScore).toBeLessThan(4.0);
  });

  it('should include distance in result when coordinates provided', () => {
    const preferences = createMockPreferences({
      preferredLatitude: -6.2088,
      preferredLongitude: 106.8456,
    });
    const kos = createMockKos({
      latitude: -6.2088,
      longitude: 106.8456,
    });

    const result = calculateMatchingScore(kos, preferences);

    expect(result.distance).toBeDefined();
    expect(result.distance).toBeCloseTo(0, 2);
  });
});

// ============================================================
// CONSTANTS TESTS
// ============================================================

describe('Profile Matching Constants', () => {
  it('should have Core Factor percentage of 60%', () => {
    expect(CORE_FACTOR_PERCENTAGE).toBe(0.6);
  });

  it('should have Secondary Factor percentage of 40%', () => {
    expect(SECONDARY_FACTOR_PERCENTAGE).toBe(0.4);
  });

  it('should have percentages that sum to 100%', () => {
    expect(CORE_FACTOR_PERCENTAGE + SECONDARY_FACTOR_PERCENTAGE).toBe(1.0);
  });
});
