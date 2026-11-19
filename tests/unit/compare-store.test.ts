import { describe, it, expect } from 'vitest';
import {
  MAX_COMPARE_ITEMS,
  addOrToggleCompareItem,
  removeCompareItem,
  parseStoredCompareItems,
  type ComparedKosSummary,
} from '@/contexts/CompareContext';

const makeKos = (id: number, overrides: Partial<ComparedKosSummary> = {}): ComparedKosSummary => ({
  id,
  name: `Kos Sample ${id}`,
  address: `Jl. Kampus No. ${id}`,
  city: 'Semarang',
  price: 1000000 + id * 100000,
  facilities: ['WiFi', 'AC'],
  ...overrides,
});

describe('CompareContext pure helpers', () => {
  it('adds up to MAX_COMPARE_ITEMS (3) and ignores a 4th item', () => {
    let list: ComparedKosSummary[] = [];
    list = addOrToggleCompareItem(list, makeKos(1));
    list = addOrToggleCompareItem(list, makeKos(2));
    list = addOrToggleCompareItem(list, makeKos(3));
    expect(list).toHaveLength(MAX_COMPARE_ITEMS);

    const afterFourth = addOrToggleCompareItem(list, makeKos(4));
    expect(afterFourth).toHaveLength(MAX_COMPARE_ITEMS);
    expect(afterFourth.map((k) => k.id)).toEqual([1, 2, 3]);
  });

  it('toggles off an existing item when added again', () => {
    const initial = [makeKos(1), makeKos(2)];
    const toggled = addOrToggleCompareItem(initial, makeKos(1));
    expect(toggled.map((k) => k.id)).toEqual([2]);
  });

  it('removes an item by id cleanly', () => {
    const initial = [makeKos(10), makeKos(20), makeKos(30)];
    const updated = removeCompareItem(initial, 20);
    expect(updated.map((k) => k.id)).toEqual([10, 30]);
  });

  it('parses valid stored JSON, rejects malformed entries, and truncates safely to 3', () => {
    expect(parseStoredCompareItems(null)).toEqual([]);
    expect(parseStoredCompareItems('not-json')).toEqual([]);
    expect(parseStoredCompareItems('{"id":1}')).toEqual([]);

    const payload = JSON.stringify([
      makeKos(1),
      { id: 'bad-id', name: 'Broken', price: 1000 },
      makeKos(2),
      makeKos(2), // duplicate id should be ignored
      makeKos(3),
      makeKos(4), // 4th unique item should be truncated
    ]);

    const parsed = parseStoredCompareItems(payload);
    expect(parsed.map((k) => k.id)).toEqual([1, 2, 3]);
  });
});
