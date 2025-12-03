# Profile Matching SPK (Sistem Pendukung Keputusan)

## Overview

Fitur Profile Matching SPK adalah sistem rekomendasi kos yang dipersonalisasi berdasarkan preferensi pengguna. Sistem ini menggunakan metode **Profile Matching** berdasarkan metodologi Kusrini (2007) yang membandingkan profil ideal pengguna dengan karakteristik kos yang tersedia.

## Referensi

- Kusrini. (2007). Konsep dan Aplikasi Sistem Pendukung Keputusan. Andi Offset.

## Konsep Profile Matching

Profile Matching adalah metode pengambilan keputusan yang membandingkan nilai ideal (target) dengan nilai aktual dari suatu objek. Semakin kecil gap antara nilai ideal dan nilai aktual, semakin tinggi kesesuaian objek tersebut.

### Tahapan Profile Matching

1. **Pemetaan GAP**: Menghitung selisih antara profil kos dengan profil ideal user
2. **Konversi GAP ke Bobot**: Menggunakan tabel standar Kusrini (2007)
3. **Pengelompokan Kriteria**: Membagi ke Core Factor dan Secondary Factor
4. **Perhitungan NCF**: Menghitung rata-rata Core Factor
5. **Perhitungan NSF**: Menghitung rata-rata Secondary Factor
6. **Perhitungan Nilai Total**: Menggabungkan NCF dan NSF dengan persentase bobot

### Formula GAP

```
GAP = Profil Kos - Profil Ideal User
```

Untuk kriteria COST (seperti harga), rumus dibalik karena semakin rendah semakin baik:
```
GAP = Profil User - Profil Kos
```

### Tabel Konversi GAP ke Bobot (Kusrini, 2007)

| GAP | Bobot | Keterangan |
|-----|-------|------------|
| 0   | 5.0   | Tidak ada selisih (ideal) |
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
- **Core Factor (CF)**: Kriteria utama yang HARUS dipenuhi (bobot 60%)
  - Harga (budget)
  - Lokasi (jarak/kota)
  - Rating (reputasi)
- **Secondary Factor (SF)**: Kriteria pendukung yang DIHARAPKAN terpenuhi (bobot 40%)
  - Fasilitas

### Formula Nilai Total

```
NCF = (Skor Harga + Skor Lokasi + Skor Rating) / 3
NSF = Skor Fasilitas

Nilai Total = (60% x NCF) + (40% x NSF)
```

---

## Penentuan Bobot Kriteria (ROC - Rank Order Centroid)

Bobot default kriteria ditentukan menggunakan metode ROC berdasarkan urutan prioritas umum pencari kos:

### Urutan Prioritas (berdasarkan survei umum):
1. **Harga** (Rank 1) - Paling penting karena keterbatasan budget mahasiswa/pekerja
2. **Lokasi** (Rank 2) - Kedekatan dengan kampus/kantor
3. **Fasilitas** (Rank 3) - Kenyamanan tinggal
4. **Rating** (Rank 4) - Reputasi kos

### Perhitungan ROC (n=4 kriteria):

```
w1 = (1/n) * (1/1 + 1/2 + 1/3 + 1/4) = 0.521 -> 52%
w2 = (1/n) * (1/2 + 1/3 + 1/4) = 0.271 -> 27%
w3 = (1/n) * (1/3 + 1/4) = 0.146 -> 15%
w4 = (1/n) * (1/4) = 0.063 -> 6%
```

### Bobot Default yang Digunakan:
| Kriteria | Bobot ROC | Bobot Default |
|----------|-----------|---------------|
| Harga    | 52.1%     | 52            |
| Lokasi   | 27.1%     | 27            |
| Fasilitas| 14.6%     | 15            |
| Rating   | 6.3%      | 6             |

---

## Pemetaan Level untuk GAP Calculation

### 1. Level Harga

Konversi harga ke level 1-5 berdasarkan range harga kos di Indonesia:

| Level | Range Harga | Kategori |
|-------|-------------|----------|
| 1     | <= Rp 500.000 | Sangat Murah |
| 2     | Rp 500.001 - Rp 1.000.000 | Murah |
| 3     | Rp 1.000.001 - Rp 1.500.000 | Sedang |
| 4     | Rp 1.500.001 - Rp 2.500.000 | Mahal |
| 5     | > Rp 2.500.000 | Sangat Mahal |

**Contoh perhitungan:**
- Budget user: Rp 1.500.000 (Level 3)
- Harga kos: Rp 1.200.000 (Level 3)
- GAP = 3 - 3 = 0 -> Bobot 5.0 (Ideal)

### 2. Level Jarak

Konversi jarak ke level 1-5 (semakin dekat semakin tinggi):

| Level | Jarak | Kategori |
|-------|-------|----------|
| 5     | <= 1 km | Sangat Dekat |
| 4     | 1-5 km | Dekat |
| 3     | 5-10 km | Sedang |
| 2     | 10-15 km | Jauh |
| 1     | > 15 km | Sangat Jauh |

### 3. Level Rating

Rating sudah dalam skala 1-5, langsung digunakan dengan pembulatan.

### 4. Level Fasilitas

Berdasarkan persentase fasilitas required yang terpenuhi:

| Level | Persentase | Kategori |
|-------|------------|----------|
| 1     | 0-20%      | Sangat Kurang |
| 2     | 21-40%     | Kurang |
| 3     | 41-60%     | Cukup |
| 4     | 61-80%     | Baik |
| 5     | 81-100%    | Sangat Baik |

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
    preferred_cities TEXT,                 -- JSON array of preferred cities
    preferred_latitude DOUBLE PRECISION,   -- User's preferred location lat
    preferred_longitude DOUBLE PRECISION,  -- User's preferred location lng
    max_distance_km DECIMAL(5,2),         -- Maximum distance in km
    
    -- Facilities Preferences (Secondary Factor)
    required_facilities TEXT,              -- JSON array of must-have facilities
    optional_facilities TEXT,              -- JSON array of nice-to-have facilities
    
    -- Room Preferences
    room_type TEXT DEFAULT 'any',          -- 'single', 'shared', 'any'
    
    -- Quality Preferences (Core Factor)
    min_rating DECIMAL(2,1) DEFAULT 3.0,  -- Minimum acceptable rating (1.0-5.0)
    
    -- Availability Preferences
    needs_available_room BOOLEAN DEFAULT TRUE,
    
    -- Weighting Preferences (ROC-based defaults)
    weight_price INTEGER DEFAULT 52,       -- Bobot harga (ROC: 52%)
    weight_location INTEGER DEFAULT 27,    -- Bobot lokasi (ROC: 27%)
    weight_facilities INTEGER DEFAULT 15,  -- Bobot fasilitas (ROC: 15%)
    weight_rating INTEGER DEFAULT 6,       -- Bobot rating (ROC: 6%)
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id)
);
```

---

## Kriteria Profile Matching

### 1. Kriteria Harga (Core Factor) - Bobot Default: 52%

Mencocokkan harga kos dengan budget user menggunakan GAP level-based.

**Proses:**
1. Konversi harga kos ke level (1-5)
2. Konversi budget user ke level (1-5)
3. Hitung GAP = Level User - Level Kos
4. Konversi GAP ke bobot menggunakan tabel Kusrini

### 2. Kriteria Lokasi (Core Factor) - Bobot Default: 27%

Mencocokkan lokasi kos dengan preferensi user.

**Berdasarkan Koordinat:**
1. Hitung jarak Haversine antara kos dan lokasi preferensi
2. Konversi jarak ke level (1-5)
3. GAP = Level Kos - Level Ideal (5)
4. Konversi GAP ke bobot

**Berdasarkan Kota:**
- Kota match = Level 5 -> GAP 0 -> Bobot 5.0
- Kota tidak match = Level 1 -> GAP -4 -> Bobot 1.0

### 3. Kriteria Fasilitas (Secondary Factor) - Bobot Default: 15%

Mencocokkan fasilitas kos dengan kebutuhan user.

**Proses:**
1. Hitung persentase fasilitas required yang terpenuhi
2. Tambah bonus dari optional facilities (max 20%)
3. Konversi persentase ke level (1-5)
4. GAP = Level Kos - Level Ideal (5)
5. Konversi GAP ke bobot

### 4. Kriteria Rating (Core Factor) - Bobot Default: 6%

Mencocokkan rating kos dengan standar minimum user.

**Proses:**
1. Konversi rating kos ke level (pembulatan 1-5)
2. Konversi min rating user ke level
3. GAP = Level Kos - Level User
4. Konversi GAP ke bobot
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
