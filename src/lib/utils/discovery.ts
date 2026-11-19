/**
 * Shared discovery formatting and normalization helpers for Kosera UI components.
 */

export function parsePriceValue(price: number | string): number {
  if (typeof price === 'number') {
    return Number.isFinite(price) && price > 0 ? Math.round(price) : 0;
  }
  const digitsOnly = price.replace(/[^\d]/g, '');
  if (!digitsOnly) return 0;
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function normalizeSpkScore(score: number): number {
  if (!Number.isFinite(score) || score <= 0) return 0;
  const normalized = score <= 5 ? (score / 5) * 100 : score;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

export function formatCompactPricePin(price: number): string {
  const safePrice = Number.isFinite(price) && price > 0 ? price : 0;
  if (safePrice >= 1_000_000) {
    const millions = safePrice / 1_000_000;
    const compact = Number(millions.toFixed(2)).toString();
    return `Rp ${compact}jt`;
  }
  if (safePrice >= 1_000) {
    const thousands = Math.round(safePrice / 1_000);
    return `Rp ${thousands}rb`;
  }
  return `Rp ${Math.round(safePrice)}`;
}

export function formatRupiah(price: number): string {
  const safePrice = Number.isFinite(price) && price > 0 ? Math.round(price) : 0;
  return `Rp ${safePrice.toLocaleString('id-ID')}`;
}

export interface SpkWeightValues {
  price: number;
  location: number;
  facilities: number;
  rating: number;
}

export const DEFAULT_SPK_WEIGHTS: SpkWeightValues = {
  price: 30,
  location: 25,
  facilities: 25,
  rating: 20,
};

export function normalizeWeightsTo100(weights: SpkWeightValues): SpkWeightValues {
  const keys: Array<keyof SpkWeightValues> = [
    'price',
    'location',
    'facilities',
    'rating',
  ];

  const sanitized = keys.map((key) => {
    const raw = weights[key];
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  });

  const sum = sanitized.reduce((acc, val) => acc + val, 0);
  if (sum <= 0) {
    return { ...DEFAULT_SPK_WEIGHTS };
  }

  const exacts = sanitized.map((val) => (val / sum) * 100);
  const floors = exacts.map((val) => Math.floor(val));
  let remainder = 100 - floors.reduce((acc, val) => acc + val, 0);

  const byFraction = exacts
    .map((val, idx) => ({ idx, frac: val - floors[idx] }))
    .sort((a, b) => b.frac - a.frac);

  for (let i = 0; i < byFraction.length && remainder > 0; i++) {
    floors[byFraction[i].idx] += 1;
    remainder -= 1;
  }

  return {
    price: floors[0],
    location: floors[1],
    facilities: floors[2],
    rating: floors[3],
  };
}

export function computeLiveSpkScore(
  details: {
    priceScore: number;
    locationScore: number;
    facilitiesScore: number;
    ratingScore: number;
  },
  weights: SpkWeightValues
): number {
  const norm = normalizeWeightsTo100(weights);
  const weighted =
    (details.priceScore * norm.price +
      details.locationScore * norm.location +
      details.facilitiesScore * norm.facilities +
      details.ratingScore * norm.rating) /
    100;

  if (!Number.isFinite(weighted)) return 0;
  return Math.round(weighted * 100) / 100;
}

