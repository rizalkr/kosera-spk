/**
 * Profile Matching Scoring Functions
 * 
 * Implementasi algoritma Profile Matching untuk Sistem Pendukung Keputusan (SPK)
 * pemilihan kos berdasarkan metodologi Kusrini (2007).
 * 
 * Tahapan Profile Matching:
 * 1. Pemetaan GAP: Selisih antara profil kos dengan profil ideal user
 * 2. Konversi GAP ke Bobot: Menggunakan tabel standar Kusrini
 * 3. Perhitungan Core Factor (NCF): Rata-rata faktor utama
 * 4. Perhitungan Secondary Factor (NSF): Rata-rata faktor pendukung
 * 5. Perhitungan Nilai Total: (x% * NCF) + (y% * NSF)
 * 
 * Referensi:
 * - Kusrini. (2007). Konsep dan Aplikasi Sistem Pendukung Keputusan. Andi Offset.
 */

import type { UserPreferencesData, MatchingScoreDetails } from '@/types/profile-matching';

// ============================================================
// KONSTANTA PROFILE MATCHING
// ============================================================

/**
 * Persentase bobot Core Factor dan Secondary Factor
 * Berdasarkan standar umum metodologi Profile Matching (Kusrini, 2007)
 * 
 * Core Factor: Kriteria utama yang HARUS dipenuhi
 * Secondary Factor: Kriteria pendukung yang DIHARAPKAN terpenuhi
 */
export const CORE_FACTOR_PERCENTAGE = 0.6; // 60%
export const SECONDARY_FACTOR_PERCENTAGE = 0.4; // 40%

/**
 * Bobot default kriteria berdasarkan perhitungan ROC (Rank Order Centroid)
 * 
 * Asumsi urutan prioritas berdasarkan survei umum pencari kos:
 * 1. Harga (Rank 1) - Paling penting karena keterbatasan budget
 * 2. Lokasi (Rank 2) - Kedekatan dengan kampus/kantor
 * 3. Fasilitas (Rank 3) - Kenyamanan tinggal
 * 4. Rating (Rank 4) - Reputasi kos
 * 
 * Rumus ROC untuk n=4 kriteria:
 * w1 = (1/4) * (1/1 + 1/2 + 1/3 + 1/4) = 0.521
 * w2 = (1/4) * (1/2 + 1/3 + 1/4) = 0.271
 * w3 = (1/4) * (1/3 + 1/4) = 0.146
 * w4 = (1/4) * (1/4) = 0.063
 * 
 * Dinormalisasi ke persentase (total 100):
 */
export const DEFAULT_WEIGHT_PRICE = 52; // 52.1% -> 52
export const DEFAULT_WEIGHT_LOCATION = 27; // 27.1% -> 27
export const DEFAULT_WEIGHT_FACILITIES = 15; // 14.6% -> 15
export const DEFAULT_WEIGHT_RATING = 6; // 6.3% -> 6

// ============================================================
// GAP MAPPING (INTI METODE PROFILE MATCHING)
// ============================================================

/**
 * Tabel konversi GAP ke Bobot berdasarkan Kusrini (2007)
 * 
 * GAP = Profil Kos - Profil Ideal User
 * 
 * | GAP | Bobot | Keterangan |
 * |-----|-------|------------|
 * | 0   | 5.0   | Tidak ada selisih (ideal) |
 * | 1   | 4.5   | Kelebihan 1 tingkat |
 * | -1  | 4.0   | Kekurangan 1 tingkat |
 * | 2   | 3.5   | Kelebihan 2 tingkat |
 * | -2  | 3.0   | Kekurangan 2 tingkat |
 * | 3   | 2.5   | Kelebihan 3 tingkat |
 * | -3  | 2.0   | Kekurangan 3 tingkat |
 * | 4   | 1.5   | Kelebihan 4 tingkat |
 * | -4  | 1.0   | Kekurangan 4 tingkat |
 * 
 * @param gap - Selisih profil (Profil Kos - Profil User)
 * @returns Bobot nilai 1.0 - 5.0
 */
export const convertGapToWeight = (gap: number): number => {
  // Batasi gap ke range -4 sampai 4
  const clampedGap = Math.max(-4, Math.min(4, gap));
  
  switch (clampedGap) {
    case 0: return 5.0;  // Ideal match
    case 1: return 4.5;  // Sedikit lebih tinggi (untuk cost: lebih mahal sedikit)
    case -1: return 4.0; // Sedikit lebih rendah (untuk cost: lebih murah sedikit)
    case 2: return 3.5;
    case -2: return 3.0;
    case 3: return 2.5;
    case -3: return 2.0;
    case 4: return 1.5;
    case -4: return 1.0;
    default: return 1.0;
  }
};

// ============================================================
// LEVEL MAPPING FUNCTIONS
// ============================================================

/**
 * Konversi harga ke level 1-5
 * 
 * Level berdasarkan range harga kos di Indonesia:
 * - Level 1: <= Rp 500.000 (Sangat Murah)
 * - Level 2: Rp 500.001 - Rp 1.000.000 (Murah)
 * - Level 3: Rp 1.000.001 - Rp 1.500.000 (Sedang)
 * - Level 4: Rp 1.500.001 - Rp 2.500.000 (Mahal)
 * - Level 5: > Rp 2.500.000 (Sangat Mahal)
 * 
 * @param price - Harga kos per bulan
 * @returns Level 1-5
 */
export const getPriceLevel = (price: number): number => {
  if (price <= 500000) return 1;
  if (price <= 1000000) return 2;
  if (price <= 1500000) return 3;
  if (price <= 2500000) return 4;
  return 5;
};

/**
 * Konversi jarak ke level 1-5
 * 
 * Level berdasarkan jarak ke lokasi preferensi:
 * - Level 1: > 15 km (Sangat Jauh)
 * - Level 2: 10-15 km (Jauh)
 * - Level 3: 5-10 km (Sedang)
 * - Level 4: 1-5 km (Dekat)
 * - Level 5: <= 1 km (Sangat Dekat)
 * 
 * @param distanceKm - Jarak dalam kilometer
 * @returns Level 1-5 (5 = terdekat/terbaik)
 */
export const getDistanceLevel = (distanceKm: number): number => {
  if (distanceKm <= 1) return 5;
  if (distanceKm <= 5) return 4;
  if (distanceKm <= 10) return 3;
  if (distanceKm <= 15) return 2;
  return 1;
};

/**
 * Konversi rating ke level 1-5
 * 
 * Rating sudah dalam skala 1-5, dibulatkan ke integer terdekat
 * 
 * @param rating - Rating kos (1.0 - 5.0)
 * @returns Level 1-5
 */
export const getRatingLevel = (rating: number): number => {
  if (rating <= 0 || isNaN(rating)) return 1; // Belum ada rating
  return Math.max(1, Math.min(5, Math.round(rating)));
};

/**
 * Konversi persentase fasilitas terpenuhi ke level 1-5
 * 
 * - Level 1: 0-20% fasilitas terpenuhi
 * - Level 2: 21-40% fasilitas terpenuhi
 * - Level 3: 41-60% fasilitas terpenuhi
 * - Level 4: 61-80% fasilitas terpenuhi
 * - Level 5: 81-100% fasilitas terpenuhi
 * 
 * @param fulfillmentPercentage - Persentase fasilitas yang terpenuhi (0-100)
 * @returns Level 1-5
 */
export const getFacilitiesLevel = (fulfillmentPercentage: number): number => {
  if (fulfillmentPercentage <= 20) return 1;
  if (fulfillmentPercentage <= 40) return 2;
  if (fulfillmentPercentage <= 60) return 3;
  if (fulfillmentPercentage <= 80) return 4;
  return 5;
};

// ============================================================
// PRICE SCORING (GAP-BASED)
// ============================================================

/**
 * Hitung skor harga menggunakan metode Profile Matching (GAP)
 * 
 * Untuk kriteria COST (harga), logika ekonomi pencari kos:
 * - Lebih murah dari budget = BAGUS (hemat uang)
 * - Pas dengan budget = IDEAL
 * - Lebih mahal dari budget = BURUK
 * 
 * PATCH: Karena "lebih murah" seharusnya tidak dipenalti,
 * GAP positif (kos lebih murah) dianggap sama dengan GAP 0 (ideal).
 * 
 * @param price - Harga kos per bulan
 * @param budgetMin - Budget minimum user (nullable)
 * @param budgetMax - Budget maksimum user (nullable)
 * @returns Object dengan skor dan detail GAP
 */
export const calculatePriceScore = (
  price: number,
  budgetMin: number | null,
  budgetMax: number | null
): { score: number; gap: number; kosLevel: number; userLevel: number } => {
  // Jika tidak ada constraint budget, anggap ideal
  if (budgetMin === null && budgetMax === null) {
    return { score: 5.0, gap: 0, kosLevel: getPriceLevel(price), userLevel: getPriceLevel(price) };
  }

  // Gunakan budget max sebagai target, atau budget min jika max tidak ada
  const targetBudget = budgetMax ?? budgetMin!;
  
  const kosLevel = getPriceLevel(price);
  const userLevel = getPriceLevel(targetBudget);
  
  // GAP = Level User - Level Kos
  // Gap positif = kos lebih murah dari budget
  // Gap negatif = kos lebih mahal dari budget
  let gap = userLevel - kosLevel;
  
  // PATCH: Untuk kriteria COST, "lebih murah" tidak boleh dipenalti
  // Jika gap > 0 (kos lebih murah), anggap sebagai ideal (gap = 0)
  if (gap > 0) {
    gap = 0;
  }
  
  const score = convertGapToWeight(gap);
  
  return { score, gap, kosLevel, userLevel };
};

// ============================================================
// LOCATION SCORING (GAP-BASED)
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
 * Hitung skor lokasi menggunakan metode Profile Matching (GAP)
 * 
 * Untuk kriteria BENEFIT (lokasi), semakin dekat semakin baik.
 * GAP = Level Jarak Kos - Level Ideal User (Level 5 = terdekat)
 * 
 * Jika user set preferensi koordinat:
 * - Hitung jarak aktual, konversi ke level
 * - GAP = Level Kos - 5 (user ingin level 5 = terdekat)
 * 
 * Jika user set preferensi kota:
 * - Kota match = Level 5, tidak match = Level 1
 * 
 * @returns Object dengan skor, GAP, dan jarak (jika ada)
 */
export const calculateLocationScore = (
  kosCity: string,
  kosLat: number | null,
  kosLng: number | null,
  preferredCities: string[],
  prefLat: number | null,
  prefLng: number | null,
  maxDistanceKm: number | null
): { score: number; gap: number; kosLevel: number; userLevel: number; distance?: number } => {
  // User level ideal = 5 (terdekat)
  const userLevel = 5;
  
  // Jika ada koordinat preferensi dan kos punya koordinat
  if (prefLat !== null && prefLng !== null && kosLat !== null && kosLng !== null) {
    const distance = calculateDistance(prefLat, prefLng, kosLat, kosLng);
    const kosLevel = getDistanceLevel(distance);
    
    // Jika melebihi jarak maksimum yang diset user, beri penalty
    if (maxDistanceKm !== null && distance > maxDistanceKm) {
      return { score: 1.0, gap: -4, kosLevel: 1, userLevel, distance };
    }
    
    // GAP = Level Kos - Level User (untuk benefit, kos harus >= ideal)
    const gap = kosLevel - userLevel;
    const score = convertGapToWeight(gap);
    
    return { score, gap, kosLevel, userLevel, distance };
  }
  
  // City-based scoring
  if (preferredCities.length > 0) {
    const cityMatches = preferredCities.some(
      (city) => city.toLowerCase() === kosCity.toLowerCase()
    );
    const kosLevel = cityMatches ? 5 : 1;
    const gap = kosLevel - userLevel;
    
    return { score: convertGapToWeight(gap), gap, kosLevel, userLevel };
  }
  
  // Tidak ada preferensi lokasi = ideal match
  return { score: 5.0, gap: 0, kosLevel: 5, userLevel: 5 };
};

// ============================================================
// FACILITIES SCORING (GAP-BASED)
// ============================================================

/**
 * Parse facilities string into array.
 */
export const parseFacilities = (facilities: string | null): string[] => {
  if (!facilities) return [];
  return facilities
    .split(',')
    .map((f) => f.trim().toLowerCase())
    .filter((f) => f.length > 0);
};

/**
 * Hitung skor fasilitas menggunakan metode Profile Matching (GAP)
 * 
 * Untuk kriteria BENEFIT (fasilitas), semakin banyak semakin baik.
 * Hitung persentase fasilitas required yang terpenuhi.
 * 
 * @returns Object dengan skor, GAP, dan detail
 */
export const calculateFacilitiesScore = (
  kosFacilities: string | null,
  requiredFacilities: string[],
  optionalFacilities: string[]
): { score: number; gap: number; kosLevel: number; userLevel: number; matchedCount: number; totalRequired: number } => {
  // User level ideal = 5 (semua fasilitas terpenuhi)
  const userLevel = 5;
  
  // Jika tidak ada preferensi fasilitas = ideal match
  if (requiredFacilities.length === 0 && optionalFacilities.length === 0) {
    return { score: 5.0, gap: 0, kosLevel: 5, userLevel: 5, matchedCount: 0, totalRequired: 0 };
  }

  const kosFacilitiesList = parseFacilities(kosFacilities);
  
  // Hitung fasilitas required yang terpenuhi
  let requiredMatched = 0;
  for (const required of requiredFacilities) {
    const normalizedRequired = required.toLowerCase();
    if (kosFacilitiesList.some((f) => f.includes(normalizedRequired) || normalizedRequired.includes(f))) {
      requiredMatched++;
    }
  }
  
  // Hitung persentase (berdasarkan required saja karena itu yang HARUS)
  const totalRequired = requiredFacilities.length || 1;
  const fulfillmentPercentage = (requiredMatched / totalRequired) * 100;
  
  // Bonus dari optional (tambahan 20% jika semua optional terpenuhi)
  let optionalBonus = 0;
  if (optionalFacilities.length > 0) {
    let optionalMatched = 0;
    for (const optional of optionalFacilities) {
      const normalizedOptional = optional.toLowerCase();
      if (kosFacilitiesList.some((f) => f.includes(normalizedOptional) || normalizedOptional.includes(f))) {
        optionalMatched++;
      }
    }
    optionalBonus = (optionalMatched / optionalFacilities.length) * 20;
  }
  
  const adjustedPercentage = Math.min(100, fulfillmentPercentage + optionalBonus);
  const kosLevel = getFacilitiesLevel(adjustedPercentage);
  
  // GAP = Level Kos - Level User (untuk benefit)
  const gap = kosLevel - userLevel;
  const score = convertGapToWeight(gap);
  
  return { score, gap, kosLevel, userLevel, matchedCount: requiredMatched, totalRequired };
};

// ============================================================
// RATING SCORING (GAP-BASED)
// ============================================================

/**
 * Hitung skor rating menggunakan metode Profile Matching (GAP)
 * 
 * Untuk kriteria BENEFIT (rating), semakin tinggi semakin baik.
 * 
 * @returns Object dengan skor dan detail GAP
 */
export const calculateRatingScore = (
  kosRating: number | string,
  minRating: number
): { score: number; gap: number; kosLevel: number; userLevel: number } => {
  const rating = typeof kosRating === 'string' ? parseFloat(kosRating) : kosRating;
  
  const kosLevel = getRatingLevel(rating);
  const userLevel = getRatingLevel(minRating);
  
  // GAP = Level Kos - Level User (untuk benefit, kos harus >= ideal)
  const gap = kosLevel - userLevel;
  const score = convertGapToWeight(gap);
  
  return { score, gap, kosLevel, userLevel };
};

// ============================================================
// COMPOSITE SCORING (PROFILE MATCHING)
// ============================================================

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

/**
 * Hitung skor total menggunakan metode Profile Matching
 * 
 * Tahapan:
 * 1. Hitung GAP untuk setiap kriteria
 * 2. Konversi GAP ke bobot (1.0 - 5.0)
 * 3. Kelompokkan ke Core Factor dan Secondary Factor
 * 4. Hitung NCF (Nilai Rata-rata Core Factor)
 * 5. Hitung NSF (Nilai Rata-rata Secondary Factor)
 * 6. Hitung Nilai Total = (60% * NCF) + (40% * NSF)
 * 
 * Pengelompokan Kriteria:
 * - Core Factor: Harga, Lokasi, Rating (kriteria utama)
 * - Secondary Factor: Fasilitas (kriteria pendukung)
 * 
 * @param kos - Data kos
 * @param preferences - Preferensi user
 * @returns Hasil matching dengan skor dan detail
 */
export const calculateMatchingScore = (
  kos: KosDataForScoring,
  preferences: UserPreferencesData
): { score: number; details: MatchingScoreDetails; distance?: number } => {
  // ============================================================
  // TAHAP 1 & 2: Hitung GAP dan Konversi ke Bobot
  // ============================================================
  
  const priceResult = calculatePriceScore(
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
  
  const facilitiesResult = calculateFacilitiesScore(
    kos.facilities,
    preferences.requiredFacilities,
    preferences.optionalFacilities
  );
  
  const ratingResult = calculateRatingScore(
    kos.averageRating,
    preferences.minRating
  );
  
  // ============================================================
  // TAHAP 3: Kelompokkan ke Core Factor dan Secondary Factor
  // ============================================================
  
  /**
   * Core Factor: Kriteria yang HARUS dipenuhi
   * - Harga: User punya budget terbatas
   * - Lokasi: Kedekatan dengan kampus/kantor penting
   * - Rating: Reputasi kos sebagai jaminan kualitas
   */
  const coreFactorScores = [
    priceResult.score,
    locationResult.score,
    ratingResult.score,
  ];
  
  /**
   * Secondary Factor: Kriteria PENDUKUNG
   * - Fasilitas: Nice to have, bukan keharusan
   */
  const secondaryFactorScores = [
    facilitiesResult.score,
  ];
  
  // ============================================================
  // TAHAP 4: Hitung NCF (Nilai Rata-rata Core Factor)
  // ============================================================
  
  const NCF = coreFactorScores.reduce((sum, score) => sum + score, 0) / coreFactorScores.length;
  
  // ============================================================
  // TAHAP 5: Hitung NSF (Nilai Rata-rata Secondary Factor)
  // ============================================================
  
  const NSF = secondaryFactorScores.reduce((sum, score) => sum + score, 0) / secondaryFactorScores.length;
  
  // ============================================================
  // TAHAP 6: Hitung Nilai Total (Ranking)
  // Rumus: (x% * NCF) + (y% * NSF)
  // ============================================================
  
  const finalScore = (CORE_FACTOR_PERCENTAGE * NCF) + (SECONDARY_FACTOR_PERCENTAGE * NSF);
  
  return {
    score: Math.round(finalScore * 100) / 100,
    details: {
      priceScore: Math.round(priceResult.score * 100) / 100,
      locationScore: Math.round(locationResult.score * 100) / 100,
      facilitiesScore: Math.round(facilitiesResult.score * 100) / 100,
      ratingScore: Math.round(ratingResult.score * 100) / 100,
      coreFactorAvg: Math.round(NCF * 100) / 100,
      secondaryFactorAvg: Math.round(NSF * 100) / 100,
    },
    distance: locationResult.distance,
  };
};
