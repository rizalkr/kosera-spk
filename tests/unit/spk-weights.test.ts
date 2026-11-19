import { describe, it, expect } from 'vitest';
import {
  computeLiveSpkScore,
  DEFAULT_SPK_WEIGHTS,
  normalizeWeightsTo100,
} from '@/lib/utils/discovery';

describe('SPK live weight normalization and scoring', () => {
  it('normalizes arbitrary positive weights to integers summing to exactly 100', () => {
    const res1 = normalizeWeightsTo100({
      price: 10,
      location: 10,
      facilities: 10,
      rating: 10,
    });
    expect(res1.price + res1.location + res1.facilities + res1.rating).toBe(100);
    expect(res1).toEqual({ price: 25, location: 25, facilities: 25, rating: 25 });

    const res2 = normalizeWeightsTo100({
      price: 33,
      location: 17,
      facilities: 27,
      rating: 19,
    });
    expect(res2.price + res2.location + res2.facilities + res2.rating).toBe(100);
  });

  it('falls back to DEFAULT_SPK_WEIGHTS when all weights are zero or negative', () => {
    expect(
      normalizeWeightsTo100({ price: 0, location: 0, facilities: 0, rating: 0 })
    ).toEqual(DEFAULT_SPK_WEIGHTS);

    expect(
      normalizeWeightsTo100({ price: -10, location: 0, facilities: -5, rating: 0 })
    ).toEqual(DEFAULT_SPK_WEIGHTS);
  });

  it('computes weighted SPK score on 0-5 scale accurately', () => {
    const score = computeLiveSpkScore(
      {
        priceScore: 5.0,
        locationScore: 4.0,
        facilitiesScore: 4.0,
        ratingScore: 4.0,
      },
      { price: 50, location: 25, facilities: 15, rating: 10 }
    );
    // 5*0.5 + 4*0.25 + 4*0.15 + 4*0.10 = 2.5 + 1.0 + 0.6 + 0.4 = 4.5
    expect(score).toBe(4.5);
  });
});
