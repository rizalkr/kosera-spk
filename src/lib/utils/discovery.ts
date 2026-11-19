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
