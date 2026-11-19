import { describe, it, expect } from 'vitest';
import {
  parsePriceValue,
  normalizeSpkScore,
  formatCompactPricePin,
  formatRupiah,
} from '@/lib/utils/discovery';

describe('Phase 2 discovery helpers', () => {
  it('parses numeric and formatted price strings safely', () => {
    expect(parsePriceValue(1450000)).toBe(1450000);
    expect(parsePriceValue('1,450,000')).toBe(1450000);
    expect(parsePriceValue('Rp 1.450.000')).toBe(1450000);
    expect(parsePriceValue('')).toBe(0);
    expect(parsePriceValue(-500)).toBe(0);
  });

  it('normalizes both 0-5 raw SPK scores and 0-100 percentages cleanly', () => {
    expect(normalizeSpkScore(4.5)).toBe(90);
    expect(normalizeSpkScore(5)).toBe(100);
    expect(normalizeSpkScore(3.2)).toBe(64);
    expect(normalizeSpkScore(88)).toBe(88);
    expect(normalizeSpkScore(120)).toBe(100);
    expect(normalizeSpkScore(-1)).toBe(0);
  });

  it('formats compact price labels for Leaflet map price pins', () => {
    expect(formatCompactPricePin(1450000)).toBe('Rp 1.45jt');
    expect(formatCompactPricePin(1000000)).toBe('Rp 1jt');
    expect(formatCompactPricePin(1500000)).toBe('Rp 1.5jt');
    expect(formatCompactPricePin(750000)).toBe('Rp 750rb');
    expect(formatCompactPricePin(0)).toBe('Rp 0');
  });

  it('formats full Indonesian Rupiah amounts cleanly', () => {
    expect(formatRupiah(1450000)).toBe('Rp 1.450.000');
    expect(formatRupiah(750000)).toBe('Rp 750.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });
});
