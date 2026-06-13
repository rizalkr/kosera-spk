# Profile Matching DSS (Decision Support System)

## Overview

The Profile Matching Decision Support System (DSS) is a personalized property recommendation engine. This system utilizes the **Profile Matching** method based on Kusrini's (2007) methodology, which evaluates and compares a user's ideal profile against the specific characteristics of available properties.

## References

- Kusrini. (2007). Konsep dan Aplikasi Sistem Pendukung Keputusan. Andi Offset.

## Core Concepts

Profile Matching is a decision-making methodology that calculates the mathematical distance between an ideal (target) value and the actual value of an entity. A smaller gap between the ideal and actual values denotes a higher suitability for the user.

### Evaluation Stages

1. **GAP Mapping**: Calculating the mathematical difference between the property profile and the user's ideal profile.
2. **Weight Conversion**: Translating the GAP value into a standardized weight using Kusrini's (2007) reference table.
3. **Criteria Categorization**: Dividing attributes into Core Factors and Secondary Factors.
4. **NCF Calculation**: Calculating the average score for Core Factors.
5. **NSF Calculation**: Calculating the average score for Secondary Factors.
6. **Final Score Aggregation**: Combining NCF and NSF using predetermined percentage weights.

### GAP Formula

```text
GAP = Property Profile - Ideal User Profile
```

For COST criteria (e.g., price), the formula is inverted because lower values represent better outcomes:
```text
GAP = Ideal User Profile - Property Profile
```

### GAP to Weight Conversion Table (Kusrini, 2007)

| GAP | Weight | Description |
|-----|--------|-------------|
| 0   | 5.0    | No deficit/excess (Ideal) |
| 1   | 4.5    | 1 level excess |
| -1  | 4.0    | 1 level deficit |
| 2   | 3.5    | 2 levels excess |
| -2  | 3.0    | 2 levels deficit |
| 3   | 2.5    | 3 levels excess |
| -3  | 2.0    | 3 levels deficit |
| 4   | 1.5    | 4 levels excess |
| -4  | 1.0    | 4 levels deficit |

### Core Factor vs. Secondary Factor

Attributes are strictly categorized into two dimensions:
- **Core Factor (CF)**: Primary requirements that MUST be fulfilled (60% weight).
  - Price (Budget constraints)
  - Location (Distance/City proximity)
  - Rating (Property reputation)
- **Secondary Factor (SF)**: Supporting requirements that are EXPECTED to be fulfilled (40% weight).
  - Facilities

### Aggregation Formula

```text
NCF = (Price Score + Location Score + Rating Score) / 3
NSF = Facilities Score

Final Score = (60% x NCF) + (40% x NSF)
```

---

## Default Criteria Weighting (ROC - Rank Order Centroid)

The default criteria weights are algorithmically determined using the ROC method, based on the general priority sequence of property seekers.

### Priority Sequence (Empirical Baseline):
1. **Price** (Rank 1) - Highest priority due to budget constraints.
2. **Location** (Rank 2) - Proximity to workplace/university.
3. **Facilities** (Rank 3) - Living comfort parameters.
4. **Rating** (Rank 4) - Trust and reputation.

### ROC Calculation (n=4 criteria):

```text
w1 = (1/n) * (1/1 + 1/2 + 1/3 + 1/4) = 0.521 -> 52%
w2 = (1/n) * (1/2 + 1/3 + 1/4) = 0.271 -> 27%
w3 = (1/n) * (1/3 + 1/4) = 0.146 -> 15%
w4 = (1/n) * (1/4) = 0.063 -> 6%
```

### Applied Default Weights:
| Criteria   | ROC Weight | Applied Default |
|------------|------------|-----------------|
| Price      | 52.1%      | 52              |
| Location   | 27.1%      | 27              |
| Facilities | 14.6%      | 15              |
| Rating     | 6.3%       | 6               |

---

## Attribute Level Mapping for GAP Calculation

### 1. Price Level

Prices are normalized to a 1-5 scale based on the standard Indonesian rental market:

| Level | Price Range (IDR) | Category |
|-------|-------------------|----------|
| 1     | <= 500,000        | Very Cheap |
| 2     | 500,001 - 1,000,000 | Cheap |
| 3     | 1,000,001 - 1,500,000| Moderate |
| 4     | 1,500,001 - 2,500,000| Expensive |
| 5     | > 2,500,000       | Very Expensive |

**Calculation Example:**
- User's maximum budget: IDR 1,500,000 (Level 3)
- Property price: IDR 1,200,000 (Level 3)
- GAP = 3 - 3 = 0 -> Weight 5.0 (Ideal match)

### 2. Distance Level

Spatial proximity is converted to a 1-5 scale (shorter distance yields a higher level):

| Level | Distance | Category |
|-------|----------|----------|
| 5     | <= 1 km  | Very Close |
| 4     | 1-5 km   | Close |
| 3     | 5-10 km  | Moderate |
| 2     | 10-15 km | Far |
| 1     | > 15 km  | Very Far |

### 3. Rating Level

Property ratings strictly operate on a 1.0 - 5.0 scale and are utilized directly utilizing mathematical rounding.

### 4. Facilities Level

Evaluated based on the percentage of required facilities fulfilled:

| Level | Percentage | Category |
|-------|------------|----------|
| 1     | 0-20%      | Highly Insufficient |
| 2     | 21-40%     | Insufficient |
| 3     | 41-60%     | Adequate |
| 4     | 61-80%     | Good |
| 5     | 81-100%    | Excellent |

---

## Database Schema (Drizzle ORM Definition)

### Table: `user_preferences`

```sql
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Budget Preferences (Core Factor)
    budget_min INTEGER,                    
    budget_max INTEGER,                    
    
    -- Location Preferences (Core Factor)
    preferred_cities TEXT,                 -- JSON array payload
    preferred_latitude DOUBLE PRECISION,   
    preferred_longitude DOUBLE PRECISION,  
    max_distance_km DECIMAL(5,2),         
    
    -- Facilities Preferences (Secondary Factor)
    required_facilities TEXT,              -- JSON array payload
    optional_facilities TEXT,              -- JSON array payload
    
    -- Room Specifications
    room_type TEXT DEFAULT 'any',          -- 'single', 'shared', 'any'
    
    -- Quality Constraints (Core Factor)
    min_rating DECIMAL(2,1) DEFAULT 3.0,  
    
    -- Availability Constraints
    needs_available_room BOOLEAN DEFAULT TRUE,
    
    -- Dynamic Weight Adjustments (ROC-based defaults)
    weight_price INTEGER DEFAULT 52,       
    weight_location INTEGER DEFAULT 27,    
    weight_facilities INTEGER DEFAULT 15,  
    weight_rating INTEGER DEFAULT 6,       
    
    -- Audit Timestamps
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    
    UNIQUE(user_id)
);
```

---

## Profile Matching Execution Criteria

### 1. Price Criteria (Core Factor) - Default Weight: 52%
Executes level-based GAP mapping between property price and user budget.
**Pipeline:** Normalize property price to level -> Normalize user budget to level -> Calculate GAP -> Map to Kusrini weight.

### 2. Location Criteria (Core Factor) - Default Weight: 27%
Evaluates spatial proximity.
**Geospatial Pipeline:** Execute Haversine formula -> Convert distance to level -> GAP = Property Level - Ideal Level (5) -> Map to weight.
**City Proximity Pipeline:** Exact match = Level 5 (GAP 0, Weight 5.0), Mismatch = Level 1 (GAP -4, Weight 1.0).

### 3. Facilities Criteria (Secondary Factor) - Default Weight: 15%
Evaluates physical amenities.
**Pipeline:** Calculate fulfillment percentage of `required_facilities` -> Inject bonus multiplier from `optional_facilities` (max 20%) -> Normalize to level -> Calculate GAP -> Map to weight.

### 4. Rating Criteria (Core Factor) - Default Weight: 6%
Evaluates property reputation.
**Pipeline:** Evaluate property rating against user's `min_rating` threshold. Deficits immediately downgrade the output weight to penalize low-quality properties.

---

## REST API Endpoints

### 1. User Preferences Management

#### GET `/api/user/preferences`
Retrieves the authenticated user's preference payload.

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "budgetMin": 500000,
    "budgetMax": 1500000,
    "preferredCities": ["Semarang"],
    "requiredFacilities": ["AC", "WiFi"],
    "weightPrice": 52,
    "weightLocation": 27,
    "weightFacilities": 15,
    "weightRating": 6
  }
}
```

#### POST `/api/user/preferences`
Initializes a new preference profile.

#### PUT `/api/user/preferences`
Mutates an existing profile (supports partial updates).

#### DELETE `/api/user/preferences`
Executes a hard delete on the preference profile (resets to system defaults).

---

### 2. Recommendation Engine

#### GET `/api/kos/profile-matching`
Executes the DSS algorithm and returns paginated recommendations.

**Query Parameters:**
- `page` (number): Pagination offset
- `limit` (number): Pagination limit
- `min_score` (number): Execution threshold filter

**Response Payload:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": 1,
        "name": "Kos Mawar Elite",
        "price": 1200000,
        "matchingScore": 4.75,
        "matchingDetails": {
          "priceScore": 5.0,
          "locationScore": 5.0,
          "facilitiesScore": 4.5,
          "ratingScore": 4.5,
          "coreFactorAvg": 4.83,
          "secondaryFactorAvg": 4.5
        }
      }
    ],
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

## Algorithm Implementation (Pseudocode)

```typescript
function calculateProfileMatchingScore(kos: Kos, preferences: UserPreferences): MatchingResult {
  // 1. Calculate isolated criteria scores
  const priceScore = calculatePriceScore(kos.price, preferences.budgetMin, preferences.budgetMax);
  const locationScore = calculateLocationScore(kos, preferences);
  const facilitiesScore = calculateFacilitiesScore(kos.facilities, preferences.requiredFacilities, preferences.optionalFacilities);
  const ratingScore = calculateRatingScore(kos.averageRating, preferences.minRating);
  
  // 2. Map dimensions to Core/Secondary factors
  const coreFactorAvg = (priceScore + locationScore + ratingScore) / 3;
  const secondaryFactorAvg = facilitiesScore;
  
  // 3. Aggregate utilizing configured weights
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

## Directory Architecture

```text
src/
  app/
    api/
      user/preferences/route.ts        # Preferences CRUD controller
      kos/profile-matching/route.ts    # DSS Engine controller
    profile/preferences/page.tsx       # User preferences UI
    recommendations/page.tsx           # Rendered recommendation output
  
  components/
    features/profile-matching/         # DSS specific UI components
  
  hooks/profile-matching/              # Client-side data fetching hooks
  
  lib/profile-matching/
    algorithm.ts                       # Core mathematical logic
    scoring.ts                         # Isolated dimension evaluators
    
  db/schema.ts                         # ORM mappings
```

---

## QA & Testing Strategy

### Isolation Tests
- `tests/unit/profile-matching/algorithm.test.ts`: Validates deterministic output of the DSS formula.
- `tests/unit/profile-matching/scoring.test.ts`: Validates GAP mapping behavior.

### Integration Tests
- `tests/integration/profile-matching-api.integration.test.ts`: Validates end-to-end API payloads and transaction rollbacks.

### Expected Edge Cases
1. User provides complete preference constraints.
2. User provides minimal constraints (fallback logic execution).
3. Null state (unauthenticated user attempting to query recommendations).
4. Empty facilities mapping.

---

## Future Engineering Enhancements

1. **Machine Learning Pipeline**: Transitioning from static ROC weights to dynamic weights based on user telemetry (views, bookings).
2. **Collaborative Filtering Bridge**: Fusing Profile Matching with user-based clustering.
3. **In-Memory Caching**: Offloading scoring results to Redis for high-frequency queries.