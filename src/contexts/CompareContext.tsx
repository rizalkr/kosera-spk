'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export const MAX_COMPARE_ITEMS = 3;
export const COMPARE_STORAGE_KEY = 'kosera_compare_items';

export interface ComparedKosSpkDetails {
  priceScore: number;
  locationScore: number;
  facilitiesScore: number;
  ratingScore: number;
}

export interface ComparedKosSummary {
  id: number;
  name: string;
  address: string;
  city: string;
  price: number;
  imageUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  facilities: string[];
  availableRooms?: number;
  totalRooms?: number;
  distance?: number;
  matchingScore?: number; // 0-100 percentage or 0-5 raw scale (normalized in UI)
  matchingDetails?: ComparedKosSpkDetails;
}

export function addOrToggleCompareItem(
  list: ComparedKosSummary[],
  item: ComparedKosSummary
): ComparedKosSummary[] {
  const exists = list.some((entry) => entry.id === item.id);
  if (exists) {
    return list.filter((entry) => entry.id !== item.id);
  }
  if (list.length >= MAX_COMPARE_ITEMS) {
    return list;
  }
  return [...list, item];
}

export function removeCompareItem(
  list: ComparedKosSummary[],
  id: number
): ComparedKosSummary[] {
  return list.filter((entry) => entry.id !== id);
}

export function parseStoredCompareItems(raw: string | null): ComparedKosSummary[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validItems: ComparedKosSummary[] = [];
    for (const candidate of parsed) {
      if (
        typeof candidate === 'object' &&
        candidate !== null &&
        typeof (candidate as ComparedKosSummary).id === 'number' &&
        Number.isFinite((candidate as ComparedKosSummary).id) &&
        typeof (candidate as ComparedKosSummary).name === 'string' &&
        typeof (candidate as ComparedKosSummary).price === 'number' &&
        Number.isFinite((candidate as ComparedKosSummary).price)
      ) {
        const record = candidate as ComparedKosSummary;
        if (!validItems.some((existing) => existing.id === record.id)) {
          validItems.push({
            ...record,
            address: typeof record.address === 'string' ? record.address : '',
            city: typeof record.city === 'string' ? record.city : '',
            facilities: Array.isArray(record.facilities)
              ? record.facilities.filter((f): f is string => typeof f === 'string')
              : [],
          });
        }
      }
      if (validItems.length >= MAX_COMPARE_ITEMS) break;
    }

    return validItems;
  } catch {
    return [];
  }
}

interface CompareContextValue {
  comparedItems: ComparedKosSummary[];
  isCompared: (id: number) => boolean;
  toggleCompare: (item: ComparedKosSummary) => void;
  removeCompare: (id: number) => void;
  clearCompare: () => void;
  maxReached: boolean;
  maxItems: number;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [comparedItems, setComparedItems] = useState<ComparedKosSummary[]>([]);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(COMPARE_STORAGE_KEY);
      const parsed = parseStoredCompareItems(stored);
      if (parsed.length > 0) {
        setComparedItems(parsed);
      }
    } catch {
      // Ignore storage access errors in restricted contexts
    } finally {
      hasHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    try {
      if (comparedItems.length === 0) {
        window.sessionStorage.removeItem(COMPARE_STORAGE_KEY);
      } else {
        window.sessionStorage.setItem(
          COMPARE_STORAGE_KEY,
          JSON.stringify(comparedItems)
        );
      }
    } catch {
      // Ignore storage write errors in restricted contexts
    }
  }, [comparedItems]);

  const isCompared = useCallback(
    (id: number) => comparedItems.some((item) => item.id === id),
    [comparedItems]
  );

  const toggleCompare = useCallback((item: ComparedKosSummary) => {
    setComparedItems((prev) => addOrToggleCompareItem(prev, item));
  }, []);

  const removeCompare = useCallback((id: number) => {
    setComparedItems((prev) => removeCompareItem(prev, id));
  }, []);

  const clearCompare = useCallback(() => {
    setComparedItems([]);
  }, []);

  const value = useMemo<CompareContextValue>(
    () => ({
      comparedItems,
      isCompared,
      toggleCompare,
      removeCompare,
      clearCompare,
      maxReached: comparedItems.length >= MAX_COMPARE_ITEMS,
      maxItems: MAX_COMPARE_ITEMS,
    }),
    [comparedItems, isCompared, toggleCompare, removeCompare, clearCompare]
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
