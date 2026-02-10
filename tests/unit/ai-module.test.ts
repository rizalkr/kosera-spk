/**
 * AI Module Unit Tests
 *
 * Pure unit tests for AI hybrid scoring algorithm.
 * Tests the mathematical formulas without requiring database or AI service.
 *
 * @module tests/unit/ai-module.test
 */

import { describe, it, expect } from 'vitest';

// ============================================================
// HYBRID SCORE CALCULATION TESTS
// ============================================================

/**
 * Normalize cosine similarity (0-1) to score (0-100)
 * Reimplemented here for testing without importing the module
 */
const normalizeSemanticScore = (similarity: number): number => {
  const clamped = Math.max(0, Math.min(1, similarity));
  return Math.round(clamped * 100);
};

/**
 * Calculate hybrid score using weighted average
 * Reimplemented here for testing
 */
const calculateHybridScore = (
  pmScore: number,
  aiScore: number,
  weightPM: number,
  weightAI: number
): number => {
  const totalWeight = weightPM + weightAI;
  const normalizedWeightPM = weightPM / totalWeight;
  const normalizedWeightAI = weightAI / totalWeight;
  return Math.round((normalizedWeightPM * pmScore) + (normalizedWeightAI * aiScore));
};

describe('Hybrid Algorithm', () => {
  describe('Default Weights', () => {
    it('should use default weights of 0.7 PM and 0.3 AI', () => {
      const DEFAULT_HYBRID_WEIGHT_PM = 0.7;
      const DEFAULT_HYBRID_WEIGHT_AI = 0.3;

      expect(DEFAULT_HYBRID_WEIGHT_PM).toBe(0.7);
      expect(DEFAULT_HYBRID_WEIGHT_AI).toBe(0.3);
      expect(DEFAULT_HYBRID_WEIGHT_PM + DEFAULT_HYBRID_WEIGHT_AI).toBe(1);
    });
  });

  describe('Semantic Score Normalization', () => {
    it('should normalize similarity 0.85 to score 85', () => {
      expect(normalizeSemanticScore(0.85)).toBe(85);
    });

    it('should normalize similarity 0 to score 0', () => {
      expect(normalizeSemanticScore(0)).toBe(0);
    });

    it('should normalize similarity 1 to score 100', () => {
      expect(normalizeSemanticScore(1)).toBe(100);
    });

    it('should clamp negative similarity to 0', () => {
      expect(normalizeSemanticScore(-0.1)).toBe(0);
      expect(normalizeSemanticScore(-1)).toBe(0);
    });

    it('should clamp similarity > 1 to 100', () => {
      expect(normalizeSemanticScore(1.5)).toBe(100);
      expect(normalizeSemanticScore(2)).toBe(100);
    });

    it('should handle 0.5 similarity correctly', () => {
      expect(normalizeSemanticScore(0.5)).toBe(50);
    });

    it('should round to nearest integer', () => {
      expect(normalizeSemanticScore(0.854)).toBe(85);
      expect(normalizeSemanticScore(0.856)).toBe(86);
    });
  });

  describe('Hybrid Score Calculation', () => {
    it('should calculate weighted average with default weights', () => {
      const pmScore = 80;
      const aiScore = 60;
      const weightPM = 0.7;
      const weightAI = 0.3;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // 0.7 * 80 + 0.3 * 60 = 56 + 18 = 74
      expect(hybridScore).toBe(74);
    });

    it('should handle equal weights', () => {
      const pmScore = 70;
      const aiScore = 90;
      const weightPM = 0.5;
      const weightAI = 0.5;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // 0.5 * 70 + 0.5 * 90 = 35 + 45 = 80
      expect(hybridScore).toBe(80);
    });

    it('should handle AI-heavy weights', () => {
      const pmScore = 60;
      const aiScore = 95;
      const weightPM = 0.3;
      const weightAI = 0.7;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // 0.3 * 60 + 0.7 * 95 = 18 + 66.5 = 84.5 -> 85
      expect(hybridScore).toBe(85);
    });

    it('should handle PM-only mode (AI weight = 0)', () => {
      const pmScore = 85;
      const aiScore = 0;
      const weightPM = 1.0;
      const weightAI = 0;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // Pure PM score
      expect(hybridScore).toBe(85);
    });

    it('should normalize non-unit weights', () => {
      const pmScore = 80;
      const aiScore = 60;
      // Weights don't sum to 1, should be normalized
      const weightPM = 7;
      const weightAI = 3;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // Normalized: 0.7 * 80 + 0.3 * 60 = 74
      expect(hybridScore).toBe(74);
    });

    it('should handle perfect PM and AI scores', () => {
      const pmScore = 100;
      const aiScore = 100;
      const weightPM = 0.7;
      const weightAI = 0.3;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      expect(hybridScore).toBe(100);
    });

    it('should handle zero scores', () => {
      const pmScore = 0;
      const aiScore = 0;
      const weightPM = 0.7;
      const weightAI = 0.3;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      expect(hybridScore).toBe(0);
    });

    it('should handle high PM low AI scenario', () => {
      const pmScore = 95;
      const aiScore = 20;
      const weightPM = 0.7;
      const weightAI = 0.3;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // 0.7 * 95 + 0.3 * 20 = 66.5 + 6 = 72.5 -> 73
      expect(hybridScore).toBe(73);
    });

    it('should handle low PM high AI scenario', () => {
      const pmScore = 30;
      const aiScore = 98;
      const weightPM = 0.7;
      const weightAI = 0.3;

      const hybridScore = calculateHybridScore(pmScore, aiScore, weightPM, weightAI);

      // 0.7 * 30 + 0.3 * 98 = 21 + 29.4 = 50.4 -> 50
      expect(hybridScore).toBe(50);
    });
  });

  describe('Score Ranking Logic', () => {
    it('should rank kos with higher hybrid scores first', () => {
      const kosScores = [
        { id: 1, pmScore: 80, aiScore: 60, hybridScore: 0 },
        { id: 2, pmScore: 90, aiScore: 85, hybridScore: 0 },
        { id: 3, pmScore: 70, aiScore: 95, hybridScore: 0 },
      ];

      // Calculate hybrid scores
      kosScores.forEach((k) => {
        k.hybridScore = calculateHybridScore(k.pmScore, k.aiScore, 0.7, 0.3);
      });

      // Sort by hybrid score descending
      kosScores.sort((a, b) => b.hybridScore - a.hybridScore);

      // Kos 2: 0.7*90 + 0.3*85 = 63 + 25.5 = 88.5 -> 89
      // Kos 3: 0.7*70 + 0.3*95 = 49 + 28.5 = 77.5 -> 78
      // Kos 1: 0.7*80 + 0.3*60 = 56 + 18 = 74
      expect(kosScores[0].id).toBe(2);
      expect(kosScores[1].id).toBe(3);
      expect(kosScores[2].id).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small similarity values', () => {
      expect(normalizeSemanticScore(0.001)).toBe(0); // Rounds to 0
      expect(normalizeSemanticScore(0.005)).toBe(1); // Rounds to 1
    });

    it('should handle similarity close to boundaries', () => {
      expect(normalizeSemanticScore(0.994)).toBe(99);
      expect(normalizeSemanticScore(0.995)).toBe(100); // Rounds up
    });
  });
});

// ============================================================
// EMBEDDING TEXT BUILDER TESTS
// ============================================================

describe('Embedding Text Builder', () => {
  /**
   * Reimplemented buildEmbeddingText for testing without module import
   */
  const buildEmbeddingText = (data: {
    name: string;
    address: string;
    city: string;
    facilities: string | null;
    postTitle: string;
    postDescription: string;
    price: number;
    totalRooms: number;
    occupiedRooms: number | null;
  }): string => {
    const parts: string[] = [];

    parts.push(`Kos ${data.name} berlokasi di ${data.address}, ${data.city}.`);

    const priceFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(data.price);

    const availableRooms = data.totalRooms - (data.occupiedRooms || 0);
    parts.push(
      `Harga sewa ${priceFormatted} per bulan dengan ${availableRooms} kamar tersedia dari ${data.totalRooms} total kamar.`
    );

    parts.push(data.postTitle);
    parts.push(data.postDescription);

    if (data.facilities) {
      parts.push(`Fasilitas yang tersedia: ${data.facilities}.`);
    }

    return parts.join(' ').trim();
  };

  it('should include kos name and location', () => {
    const result = buildEmbeddingText({
      name: 'Kos Melati',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Selatan',
      facilities: null,
      postTitle: 'Test',
      postDescription: 'Desc',
      price: 1000000,
      totalRooms: 5,
      occupiedRooms: 2,
    });

    expect(result).toContain('Kos Melati');
    expect(result).toContain('Jl. Sudirman No. 123');
    expect(result).toContain('Jakarta Selatan');
  });

  it('should format price in Indonesian Rupiah', () => {
    const result = buildEmbeddingText({
      name: 'Test',
      address: 'Addr',
      city: 'City',
      facilities: null,
      postTitle: 'Title',
      postDescription: 'Desc',
      price: 5000000,
      totalRooms: 10,
      occupiedRooms: 5,
    });

    // Should contain formatted price
    expect(result).toMatch(/Rp\s?5[.,]000[.,]000/);
  });

  it('should calculate available rooms correctly', () => {
    const result = buildEmbeddingText({
      name: 'Test',
      address: 'Addr',
      city: 'City',
      facilities: null,
      postTitle: 'Title',
      postDescription: 'Desc',
      price: 1000000,
      totalRooms: 10,
      occupiedRooms: 7,
    });

    expect(result).toContain('3 kamar tersedia');
    expect(result).toContain('10 total kamar');
  });

  it('should handle null occupiedRooms as 0', () => {
    const result = buildEmbeddingText({
      name: 'Test',
      address: 'Addr',
      city: 'City',
      facilities: null,
      postTitle: 'Title',
      postDescription: 'Desc',
      price: 1000000,
      totalRooms: 5,
      occupiedRooms: null,
    });

    expect(result).toContain('5 kamar tersedia');
  });

  it('should include facilities when provided', () => {
    const result = buildEmbeddingText({
      name: 'Test',
      address: 'Addr',
      city: 'City',
      facilities: 'WiFi, AC, Kamar Mandi Dalam',
      postTitle: 'Title',
      postDescription: 'Desc',
      price: 1000000,
      totalRooms: 5,
      occupiedRooms: 2,
    });

    expect(result).toContain('Fasilitas yang tersedia');
    expect(result).toContain('WiFi, AC, Kamar Mandi Dalam');
  });

  it('should not include facilities section when null', () => {
    const result = buildEmbeddingText({
      name: 'Test',
      address: 'Addr',
      city: 'City',
      facilities: null,
      postTitle: 'Title',
      postDescription: 'Desc',
      price: 1000000,
      totalRooms: 5,
      occupiedRooms: 2,
    });

    expect(result).not.toContain('Fasilitas yang tersedia');
  });

  it('should include post title and description', () => {
    const result = buildEmbeddingText({
      name: 'Test',
      address: 'Addr',
      city: 'City',
      facilities: null,
      postTitle: 'Kos Nyaman untuk Mahasiswa',
      postDescription: 'Lokasi strategis dekat kampus UI.',
      price: 1000000,
      totalRooms: 5,
      occupiedRooms: 2,
    });

    expect(result).toContain('Kos Nyaman untuk Mahasiswa');
    expect(result).toContain('Lokasi strategis dekat kampus UI');
  });
});

// ============================================================
// AI SERVICE ERROR TESTS
// ============================================================

describe('AIServiceError Class', () => {
  /**
   * Reimplemented error class for testing
   */
  class AIServiceError extends Error {
    constructor(
      message: string,
      public readonly statusCode: number,
      public readonly detail?: string
    ) {
      super(message);
      this.name = 'AIServiceError';
    }
  }

  it('should create error with all properties', () => {
    const error = new AIServiceError('Test error', 503, 'Service unavailable');

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(503);
    expect(error.detail).toBe('Service unavailable');
    expect(error.name).toBe('AIServiceError');
  });

  it('should work without detail', () => {
    const error = new AIServiceError('Connection failed', 500);

    expect(error.message).toBe('Connection failed');
    expect(error.statusCode).toBe(500);
    expect(error.detail).toBeUndefined();
  });

  it('should be an instance of Error', () => {
    const error = new AIServiceError('Test', 500);

    expect(error instanceof Error).toBe(true);
  });

  it('should have correct HTTP status codes', () => {
    const badRequest = new AIServiceError('Bad request', 400);
    const unauthorized = new AIServiceError('Unauthorized', 401);
    const notFound = new AIServiceError('Not found', 404);
    const serverError = new AIServiceError('Server error', 500);
    const unavailable = new AIServiceError('Unavailable', 503);

    expect(badRequest.statusCode).toBe(400);
    expect(unauthorized.statusCode).toBe(401);
    expect(notFound.statusCode).toBe(404);
    expect(serverError.statusCode).toBe(500);
    expect(unavailable.statusCode).toBe(503);
  });
});
