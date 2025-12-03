# Profile Matching SPK (Sistem Pendukung Keputusan)

## Overview

Fitur Profile Matching SPK adalah sistem rekomendasi kos yang dipersonalisasi berdasarkan preferensi pengguna. Sistem ini menggunakan metode **Profile Matching** yang membandingkan profil ideal pengguna dengan karakteristik kos yang tersedia.

## Konsep Profile Matching

Profile Matching adalah metode pengambilan keputusan yang membandingkan nilai ideal (target) dengan nilai aktual dari suatu objek. Semakin kecil gap antara nilai ideal dan nilai aktual, semakin tinggi kesesuaian objek tersebut.

### Formula Dasar

```
Gap = Nilai Aktual - Nilai Target
```

Setiap gap kemudian dikonversi menjadi bobot menggunakan tabel konversi:

| Gap | Bobot | Keterangan |
|-----|-------|------------|
| 0   | 5.0   | Tidak ada gap (ideal) |
| 1   | 4.5   | Kelebihan 1 tingkat |
| -1  | 4.0   | Kekurangan 1 tingkat |
| 2   | 3.5   | Kelebihan 2 tingkat |
| -2  | 3.0   | Kekurangan 2 tingkat |
| 3   | 2.5   | Kelebihan 3 tingkat |
| -3  | 2.0   | Kekurangan 3 tingkat |
| 4   | 1.5   | Kelebihan 4 tingkat |
| -4  | 1.0   | Kekurangan 4 tingkat |

### Core Factor vs Secondary Factor

Kriteria dibagi menjadi dua kategori:
- **Core Factor (CF)**: Kriteria utama yang wajib dipenuhi (bobot 60%)
- **Secondary Factor (SF)**: Kriteria pendukung (bobot 40%)

```
Nilai Total = (60% x NCF) + (40% x NSF)
```

Dimana:
- NCF = Nilai rata-rata Core Factor
- NSF = Nilai rata-rata Secondary Factor

---

## Database Schema

### Tabel: user_preferences

```sql
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Budget Preferences (Core Factor)
    budget_min INTEGER,                    -- Minimum budget (nullable = no minimum)
    budget_max INTEGER,                    -- Maximum budget (nullable = no maximum)
    
    -- Location Preferences (Core Factor)
    preferred_cities TEXT[],               -- Array of preferred cities
    preferred_latitude DOUBLE PRECISION,   -- User's preferred location lat
    preferred_longitude DOUBLE PRECISION,  -- User's preferred location lng
    max_distance_km DECIMAL(5,2),         -- Maximum distance in km
    
    -- Facilities Preferences (Secondary Factor)
    required_facilities TEXT[],            -- Must-have facilities
    optional_facilities TEXT[],            -- Nice-to-have facilities
    
    -- Room Preferences (Secondary Factor)
    min_room_size INTEGER,                 -- Minimum room size (if tracked)
    room_type TEXT,                        -- 'single', 'shared', 'any'
    
    -- Quality Preferences (Core Factor)
    min_rating DECIMAL(2,1),              -- Minimum acceptable rating (1.0-5.0)
    
    -- Availability Preferences
    needs_available_room BOOLEAN DEFAULT TRUE,
    
    -- Weighting Preferences (optional user-defined weights)
    weight_price INTEGER DEFAULT 30,       -- Weight for price matching (0-100)
    weight_location INTEGER DEFAULT 25,    -- Weight for location matching
    weight_facilities INTEGER DEFAULT 25,  -- Weight for facilities matching
    weight_rating INTEGER DEFAULT 20,      -- Weight for rating matching
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id)
);
```

---

## Kriteria Profile Matching

### 1. Kriteria Harga (Core Factor) - Bobot Default: 30%

Mencocokkan harga kos dengan budget range pengguna.

| Kondisi | Skor |
|---------|------|
| Harga dalam range budget | 5.0 |
| Harga < budget_min (lebih murah) | 4.5 |
| Harga sedikit di atas budget_max (< 10%) | 4.0 |
| Harga di atas budget_max (10-20%) | 3.0 |
| Harga di atas budget_max (20-30%) | 2.0 |
| Harga di atas budget_max (> 30%) | 1.0 |

### 2. Kriteria Lokasi (Core Factor) - Bobot Default: 25%

Mencocokkan lokasi kos dengan preferensi kota atau jarak.

**Berdasarkan Kota:**
| Kondisi | Skor |
|---------|------|
| Kota sesuai preferensi | 5.0 |
| Kota tidak sesuai | 1.0 |

**Berdasarkan Jarak (jika koordinat tersedia):**
| Jarak | Skor |
|-------|------|
| 0-1 km | 5.0 |
| 1-3 km | 4.5 |
| 3-5 km | 4.0 |
| 5-10 km | 3.0 |
| 10-15 km | 2.0 |
| > 15 km | 1.0 |

### 3. Kriteria Fasilitas (Secondary Factor) - Bobot Default: 25%

Mencocokkan fasilitas kos dengan kebutuhan pengguna.

```
Skor = (Jumlah Required Facilities Terpenuhi / Total Required) * 4 + 1

Bonus untuk Optional Facilities:
+0.5 untuk setiap optional facility (max +1.0)
```

### 4. Kriteria Rating (Core Factor) - Bobot Default: 20%

Mencocokkan rating kos dengan standar minimum pengguna.

| Kondisi | Skor |
|---------|------|
| Rating >= min_rating + 0.5 | 5.0 |
| Rating >= min_rating | 4.5 |
| Rating >= min_rating - 0.5 | 3.5 |
| Rating >= min_rating - 1.0 | 2.5 |
| Rating < min_rating - 1.0 | 1.0 |

---

## API Endpoints

### 1. User Preferences CRUD

#### GET /api/user/preferences
Mengambil preferensi pengguna yang sedang login.

**Response:**
```json
{
  "success": true,
  "message": "Preferences retrieved successfully",
  "data": {
    "id": 1,
    "userId": 123,
    "budgetMin": 500000,
    "budgetMax": 1500000,
    "preferredCities": ["Semarang", "Yogyakarta"],
    "requiredFacilities": ["AC", "WiFi", "Kamar Mandi Dalam"],
    "optionalFacilities": ["Parkir Motor", "Laundry"],
    "minRating": 3.5,
    "weightPrice": 30,
    "weightLocation": 25,
    "weightFacilities": 25,
    "weightRating": 20,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### POST /api/user/preferences
Membuat preferensi baru untuk pengguna.

**Request Body:**
```json
{
  "budgetMin": 500000,
  "budgetMax": 1500000,
  "preferredCities": ["Semarang", "Yogyakarta"],
  "requiredFacilities": ["AC", "WiFi"],
  "optionalFacilities": ["Parkir Motor"],
  "minRating": 3.5
}
```

#### PUT /api/user/preferences
Mengupdate preferensi pengguna.

**Request Body:** (partial update supported)
```json
{
  "budgetMax": 2000000,
  "requiredFacilities": ["AC", "WiFi", "Kamar Mandi Dalam"]
}
```

#### DELETE /api/user/preferences
Menghapus preferensi pengguna (reset ke default).

---

### 2. Profile Matching Recommendations

#### GET /api/kos/profile-matching

Mengambil rekomendasi kos berdasarkan profile matching.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Halaman |
| limit | number | 10 | Jumlah per halaman |
| min_score | number | 0 | Skor minimum untuk ditampilkan |

**Response:**
```json
{
  "success": true,
  "message": "Profile matching recommendations retrieved",
  "data": {
    "recommendations": [
      {
        "id": 1,
        "name": "Kos Mawar Elite",
        "price": 1200000,
        "city": "Semarang",
        "facilities": "AC, WiFi, Kamar Mandi Dalam, Parkir Motor",
        "averageRating": "4.5",
        "matchingScore": 4.75,
        "matchingDetails": {
          "priceScore": 5.0,
          "locationScore": 5.0,
          "facilitiesScore": 4.5,
          "ratingScore": 4.5,
          "coreFactorAvg": 4.83,
          "secondaryFactorAvg": 4.5
        },
        "photos": [...],
        "owner": {...}
      }
    ],
    "userPreferences": {
      "budgetMin": 500000,
      "budgetMax": 1500000,
      "preferredCities": ["Semarang"],
      "requiredFacilities": ["AC", "WiFi"]
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

## Algoritma Profile Matching

### Pseudocode

```typescript
function calculateProfileMatchingScore(kos: Kos, preferences: UserPreferences): MatchingResult {
  // 1. Calculate individual criteria scores
  const priceScore = calculatePriceScore(kos.price, preferences.budgetMin, preferences.budgetMax);
  const locationScore = calculateLocationScore(kos, preferences);
  const facilitiesScore = calculateFacilitiesScore(kos.facilities, preferences.requiredFacilities, preferences.optionalFacilities);
  const ratingScore = calculateRatingScore(kos.averageRating, preferences.minRating);
  
  // 2. Determine Core Factor and Secondary Factor
  // Core: Price, Location, Rating
  // Secondary: Facilities
  
  const coreFactorAvg = (priceScore + locationScore + ratingScore) / 3;
  const secondaryFactorAvg = facilitiesScore;
  
  // 3. Calculate final score with weights
  // Using 60% Core Factor, 40% Secondary Factor
  const finalScore = (0.6 * coreFactorAvg) + (0.4 * secondaryFactorAvg);
  
  // Alternative: Use user-defined weights
  const weightedScore = (
    (preferences.weightPrice / 100) * priceScore +
    (preferences.weightLocation / 100) * locationScore +
    (preferences.weightFacilities / 100) * facilitiesScore +
    (preferences.weightRating / 100) * ratingScore
  );
  
  return {
    finalScore: weightedScore,
    details: {
      priceScore,
      locationScore,
      facilitiesScore,
      ratingScore,
      coreFactorAvg,
      secondaryFactorAvg
    }
  };
}
```

---

## File Structure

```
src/
  app/
    api/
      user/
        preferences/
          route.ts          # GET, POST, PUT, DELETE preferences
      kos/
        profile-matching/
          route.ts          # GET profile matching recommendations
    profile/
      preferences/
        page.tsx            # UI untuk set preferences
    recommendations/
      page.tsx              # Halaman hasil rekomendasi
  
  components/
    features/
      profile-matching/
        PreferencesForm.tsx         # Form input preferences
        MatchingResultCard.tsx      # Card hasil matching
        MatchingScoreIndicator.tsx  # Visual skor matching
    
  hooks/
    profile-matching/
      useUserPreferences.ts   # Hook untuk preferences CRUD
      useProfileMatching.ts   # Hook untuk recommendations
  
  lib/
    profile-matching/
      algorithm.ts            # Core matching algorithm
      scoring.ts              # Individual scoring functions
      types.ts                # Type definitions
  
  types/
    profile-matching.ts       # TypeScript interfaces
  
  db/
    schema.ts                 # Updated with userPreferences table

drizzle/
  migrations/
    XXXX_add_user_preferences.sql
```

---

## UI/UX Flow

### 1. Set Preferences Flow
1. User login sebagai RENTER
2. Navigate ke Profile > Preferences
3. Isi form preferensi (budget, kota, fasilitas, rating minimum)
4. Save preferences
5. Redirect ke halaman rekomendasi

### 2. View Recommendations Flow
1. User dengan preferences tersimpan
2. Navigate ke "Rekomendasi Untuk Anda"
3. Sistem menjalankan profile matching
4. Tampilkan hasil dengan skor matching
5. User dapat sort by score, filter by criteria
6. Klik kos untuk melihat detail

### 3. Quick Match Flow (tanpa login/preferences)
1. User tanpa login
2. Tampilkan form quick preferences
3. Submit untuk hasil instant
4. Prompt untuk save preferences (login required)

---

## Testing Strategy

### Unit Tests
- `tests/unit/profile-matching/algorithm.test.ts`
- `tests/unit/profile-matching/scoring.test.ts`

### Integration Tests
- `tests/integration/profile-matching-api.integration.test.ts`

### Test Cases
1. User dengan semua preferences lengkap
2. User dengan preferences minimal
3. User tanpa preferences (fallback ke quality score)
4. Edge cases: empty facilities, no matching kos
5. Pagination dan sorting

---

## Migration Plan

1. Create migration file untuk `user_preferences` table
2. Run migration: `npm run db:migrate`
3. Seed sample preferences untuk testing
4. Deploy API endpoints
5. Deploy UI components
6. Enable feature flag (optional)

---

## Future Enhancements

1. **Machine Learning Integration**: Learn dari user behavior (views, bookings, reviews)
2. **Collaborative Filtering**: Rekomendasi berdasarkan user serupa
3. **Real-time Updates**: WebSocket untuk update recommendations
4. **A/B Testing**: Compare profile matching vs quality score
5. **Preference Auto-detection**: Infer preferences dari browsing history
