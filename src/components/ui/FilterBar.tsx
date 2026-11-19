'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { SearchParams } from '@/types';
import { useFiltersDebounce } from '@/hooks/useDebounce';
import { KECAMATAN_SEMARANG, FACILITIES } from '@/lib/constants';

interface FilterBarProps {
  onFilter?: (filters: SearchParams) => void;
  initialFilters?: SearchParams;
}

export default function FilterBar({ onFilter, initialFilters = {} }: FilterBarProps) {
  const isInitialized = useRef(false);
  
  const [searchText, setSearchText] = useState(initialFilters.search || '');
  const [city, setCity] = useState(initialFilters.city || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || '');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initialFilters.facilities || []);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Create filters object for debouncing - memoized to prevent infinite loops
  const filters = useMemo(() => ({
    search: searchText.trim() || undefined,
    city: city || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    facilities: selectedFacilities.length > 0 ? selectedFacilities : undefined,
  }), [searchText, city, minPrice, maxPrice, selectedFacilities]);

  // Use debounced filters with 400ms delay
  const { debouncedFilters, isFiltering } = useFiltersDebounce(filters, 400);

  // Auto-apply filters when debounced values change - but not on initial render
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return; // Skip first run to prevent initial trigger
    }
    
    const cleanFilters = Object.fromEntries(
      Object.entries(debouncedFilters).filter(([, value]) => value !== undefined)
    );
    onFilter?.(cleanFilters);
  }, [debouncedFilters, onFilter]);

  // Use constants from centralized file
  const facilities = [...FACILITIES.slice(0, 8)]; // Show first 8 facilities
  const kecamatanList = [...KECAMATAN_SEMARANG];

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  // Legacy search function - now only used for Enter key press
  const handleSearch = () => {
    // Immediately apply current filters without waiting for debounce
    const filters: SearchParams = {
      search: searchText.trim() || undefined,
      city: city || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      facilities: selectedFacilities.length > 0 ? selectedFacilities : undefined,
    };

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    );

    onFilter?.(cleanFilters);
  };

  const handleReset = () => {
    setSearchText('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedFacilities([]);
    onFilter?.({});
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-4 space-y-4">
      {/* Basic Search */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Text */}
        <div className="flex items-center border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] rounded-[10px] px-3 py-2 flex-1 min-w-[200px] relative">
          <svg
            className="w-4 h-4 text-[var(--ink-secondary)] mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari kos..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="outline-none bg-transparent text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {isFiltering && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)]" />
            </div>
          )}
        </div>

        {/* Kecamatan Select */}
        <div className="flex items-center border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] rounded-[10px] px-3 py-2">
          <svg
            className="w-4 h-4 text-[var(--ink-secondary)] mr-2 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="outline-none bg-transparent text-sm text-[var(--ink-primary)]"
          >
            <option value="">Semua Kecamatan</option>
            {kecamatanList.map((kecamatan) => (
              <option key={kecamatan} value={kecamatan}>
                {kecamatan}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Toggle */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-primary)] bg-[var(--accent-tint)] border border-[#BBDCD0] px-3.5 py-2.5 rounded-[10px] hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
          <span>Filter Lanjutan</span>
        </button>

        {isFiltering && (
          <div className="flex items-center gap-2 text-[var(--accent-primary)] text-xs font-medium">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)]" />
            <span>Memfilter...</span>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t border-[var(--border-stone)] pt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-2">
              Rentang Harga
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="font-mono-tabular text-sm bg-[var(--bg-canvas)] text-[var(--ink-primary)] border border-[var(--border-stone)] rounded-[10px] px-3 py-2 w-28 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]"
              />
              <span className="text-[var(--ink-secondary)]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="font-mono-tabular text-sm bg-[var(--bg-canvas)] text-[var(--ink-primary)] border border-[var(--border-stone)] rounded-[10px] px-3 py-2 w-28 outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]"
              />
              <span className="text-xs text-[var(--ink-secondary)]">ribu/bulan</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-2">
              Fasilitas
            </label>
            <div className="flex flex-wrap gap-2">
              {facilities.map((facility) => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => handleFacilityToggle(facility)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                    selectedFacilities.includes(facility)
                      ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border-[var(--border-stone)] hover:border-[var(--ink-secondary)]'
                  }`}
                >
                  {facility}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[var(--ink-primary)] px-4 py-2 border border-[var(--border-stone)] bg-[var(--bg-canvas)] rounded-[10px] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
