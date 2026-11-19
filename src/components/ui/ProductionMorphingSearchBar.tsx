'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFiltersDebounce } from '@/hooks/useDebounce';
import { FACILITIES, KECAMATAN_SEMARANG } from '@/lib/constants';
import type { SearchParams } from '@/types';
import type { SearchMode } from './SearchModeToggle';

export interface VibePreset {
  id: string;
  label: string;
  query: string;
}

export const SEMANTIC_VIBE_PRESETS: VibePreset[] = [
  {
    id: 'near-usm',
    label: 'Dekat USM di bawah 1.5jt',
    query: 'kos nyaman dekat kampus USM harga di bawah 1.5 juta',
  },
  {
    id: 'wfh-wifi',
    label: 'Tenang dengan WiFi cepat',
    query: 'kos tenang dengan wifi cepat dan meja belajar untuk kerja',
  },
  {
    id: 'ensuite-ac',
    label: 'Kamar mandi dalam & AC',
    query: 'kos kamar mandi dalam lengkap dengan AC dan kasur',
  },
  {
    id: 'tembalang-budget',
    label: 'Hemat area Tembalang',
    query: 'kos murah bersih dan strategis daerah Tembalang',
  },
];

export const BUDGET_CAP_PRESETS: Array<{ label: string; maxPrice?: number }> = [
  { label: 'Semua Harga', maxPrice: undefined },
  { label: '<= Rp 1 jt', maxPrice: 1000000 },
  { label: '<= Rp 1.5 jt', maxPrice: 1500000 },
  { label: '<= Rp 2 jt', maxPrice: 2000000 },
];

export interface SpkWeightsInput {
  price: number;
  location: number;
  facilities: number;
  rating: number;
}

export interface ProductionMorphingSearchBarProps {
  mode?: SearchMode;
  onModeChange?: (mode: SearchMode) => void;
  isAIOnline?: boolean;
  initialFilters?: SearchParams;
  onFilter?: (filters: SearchParams) => void;
  resultCount?: number;
  isLoading?: boolean;
  showSpkTuner?: boolean;
  spkWeights?: SpkWeightsInput;
  onSpkWeightsChange?: (weights: SpkWeightsInput) => void;
  className?: string;
}

export default function ProductionMorphingSearchBar({
  mode: controlledMode,
  onModeChange,
  isAIOnline = false,
  initialFilters = {},
  onFilter,
  resultCount,
  isLoading = false,
  showSpkTuner = false,
  spkWeights,
  onSpkWeightsChange,
  className = '',
}: ProductionMorphingSearchBarProps) {
  const isInitialized = useRef(false);
  const skipNextDebounce = useRef(false);

  const [internalMode, setInternalMode] = useState<SearchMode>('text');
  const activeMode = controlledMode ?? internalMode;

  const [searchText, setSearchText] = useState(initialFilters.search || '');
  const [city, setCity] = useState(initialFilters.city || '');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    initialFilters.maxPrice
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    initialFilters.facilities || []
  );
  const [activeVibeId, setActiveVibeId] = useState<string | null>(null);
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false);
  const [isTunerOpen, setIsTunerOpen] = useState(false);

  const filters = useMemo(
    () => ({
      search: searchText.trim() || undefined,
      city: city || undefined,
      maxPrice,
      facilities:
        selectedFacilities.length > 0 ? selectedFacilities : undefined,
    }),
    [searchText, city, maxPrice, selectedFacilities]
  );

  const { debouncedFilters, isFiltering } = useFiltersDebounce(filters, 400);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    if (skipNextDebounce.current) {
      skipNextDebounce.current = false;
      return;
    }

    const cleanFilters = Object.fromEntries(
      Object.entries(debouncedFilters).filter(
        ([, value]) => value !== undefined
      )
    ) as SearchParams;
    onFilter?.(cleanFilters);
  }, [debouncedFilters, onFilter]);

  const emitImmediateFilters = (next: SearchParams) => {
    skipNextDebounce.current = true;
    const cleanFilters = Object.fromEntries(
      Object.entries(next).filter(([, value]) => value !== undefined)
    ) as SearchParams;
    onFilter?.(cleanFilters);
  };

  const handleModeSwitch = (nextMode: SearchMode) => {
    if (nextMode === 'ai' && !isAIOnline) return;
    if (controlledMode === undefined) {
      setInternalMode(nextMode);
    }
    onModeChange?.(nextMode);
  };

  const handleVibeClick = (preset: VibePreset) => {
    const isDeselect = activeVibeId === preset.id;
    const nextQuery = isDeselect ? '' : preset.query;
    setActiveVibeId(isDeselect ? null : preset.id);
    setSearchText(nextQuery);
    emitImmediateFilters({
      ...filters,
      search: nextQuery.trim() || undefined,
    });
  };

  const handleBudgetPreset = (cap?: number) => {
    setMaxPrice(cap);
    emitImmediateFilters({
      ...filters,
      maxPrice: cap,
    });
  };

  const handleFacilityToggle = (facility: string) => {
    const next = selectedFacilities.includes(facility)
      ? selectedFacilities.filter((f) => f !== facility)
      : [...selectedFacilities, facility];
    setSelectedFacilities(next);
  };

  const handleReset = () => {
    setSearchText('');
    setCity('');
    setMaxPrice(undefined);
    setSelectedFacilities([]);
    setActiveVibeId(null);
    emitImmediateFilters({});
  };

  const hasActiveFilters = Boolean(
    searchText.trim() ||
      city ||
      maxPrice !== undefined ||
      selectedFacilities.length > 0 ||
      activeVibeId
  );

  const facilityChips = FACILITIES.slice(0, 10);
  const totalWeight = spkWeights
    ? spkWeights.price +
        spkWeights.location +
        spkWeights.facilities +
        spkWeights.rating || 1
    : 100;

  return (
    <div
      className={`spring-transition rounded-[20px] border bg-[var(--bg-surface)] overflow-hidden ${
        activeMode === 'ai'
          ? 'border-[var(--accent-primary)] shadow-[0_14px_34px_-18px_rgba(30,107,82,0.28)]'
          : 'border-[var(--border-stone)]'
      } ${className}`}
    >
      {/* Top Mode & Status Bar */}
      <div
        className={`spring-transition px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          activeMode === 'ai'
            ? 'bg-[var(--accent-tint)] border-[var(--accent-primary)]/20'
            : 'bg-[var(--bg-muted)]/60 border-[var(--border-stone)]'
        }`}
      >
        {/* Segmented Mode Control */}
        <div
          role="tablist"
          aria-label="Mode pencarian kos"
          className="relative inline-grid grid-cols-2 p-1 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)]"
        >
          <span
            aria-hidden="true"
            className={`spring-transition absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[8px] ${
              activeMode === 'ai'
                ? 'translate-x-full bg-[var(--accent-primary)]'
                : 'translate-x-0 bg-[var(--ink-primary)]'
            }`}
          />
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'text'}
            onClick={() => handleModeSwitch('text')}
            className={`relative z-10 px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer ${
              activeMode === 'text'
                ? 'text-white'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Filter Pencarian
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'ai'}
            disabled={!isAIOnline}
            onClick={() => handleModeSwitch('ai')}
            title={
              isAIOnline
                ? 'Gunakan pencarian bahasa natural berbasis AI'
                : 'Layanan AI sedang offline'
            }
            className={`relative z-10 px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              activeMode === 'ai'
                ? 'text-white'
                : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`}
          >
            {isAIOnline ? 'Pencarian AI' : 'AI (Offline)'}
          </button>
        </div>

        {/* Right Controls: Count + Facility Filter Toggle + Optional SPK Tuner */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {(isFiltering || isLoading) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-primary)]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
              <span>Memuat...</span>
            </span>
          )}
          {typeof resultCount === 'number' && !isLoading && (
            <span className="font-mono-tabular text-xs font-medium text-[var(--ink-secondary)]">
              {resultCount} kos
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsFacilitiesOpen((prev) => !prev)}
            aria-expanded={isFacilitiesOpen}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
              isFacilitiesOpen || selectedFacilities.length > 0
                ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>
              Fasilitas
              {selectedFacilities.length > 0
                ? ` (${selectedFacilities.length})`
                : ''}
            </span>
          </button>

          {showSpkTuner && spkWeights && onSpkWeightsChange && (
            <button
              type="button"
              onClick={() => setIsTunerOpen((prev) => !prev)}
              aria-expanded={isTunerOpen}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
                isTunerOpen
                  ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
              }`}
            >
              <span>Atur Bobot SPK</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Input & Filter Body */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor="kosera-search-input" className="sr-only">
              {activeMode === 'ai'
                ? 'Jelaskan kriteria kos yang kamu cari'
                : 'Cari nama kos, jalan, atau area'}
            </label>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-secondary)] pointer-events-none">
              {activeMode === 'ai' ? (
                <svg
                  className="w-4 h-4 text-[var(--accent-primary)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </div>
            <input
              id="kosera-search-input"
              type="text"
              value={searchText}
              onChange={(e) => {
                setActiveVibeId(null);
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  emitImmediateFilters(filters);
                }
              }}
              placeholder={
                activeMode === 'ai'
                  ? 'Contoh: kos tenang dekat kampus USM dengan wifi cepat di bawah 1.5 juta...'
                  : 'Cari nama kos, jalan, atau fasilitas...'
              }
              className={`w-full pl-10 pr-20 py-3 rounded-[10px] border text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/75 bg-[var(--bg-canvas)] focus:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 transition-colors ${
                activeMode === 'ai'
                  ? 'border-[var(--accent-primary)]/40 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]'
                  : 'border-[var(--border-stone)] focus:ring-[var(--ink-primary)]/15 focus:border-[var(--ink-primary)]'
              }`}
            />
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] px-2.5 py-1 rounded-[8px] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* District Select */}
          <div className="shrink-0">
            <label htmlFor="kosera-district-select" className="sr-only">
              Pilih Kecamatan
            </label>
            <select
              id="kosera-district-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full md:w-52 px-3.5 py-3 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-sm text-[var(--ink-primary)] focus:bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
            >
              <option value="">Semua Kecamatan</option>
              {KECAMATAN_SEMARANG.map((kecamatan) => (
                <option key={kecamatan} value={kecamatan}>
                  {kecamatan}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Strip: AI Vibe Chips OR Budget Caps */}
        {activeMode === 'ai' ? (
          <div key="ai-vibes" className="space-y-2">
            <p className="text-xs font-medium text-[var(--ink-secondary)]">
              Saran pencarian cepat — klik untuk langsung mencari:
            </p>
            <div className="flex flex-wrap gap-2">
              {SEMANTIC_VIBE_PRESETS.map((preset, index) => {
                const isActive = activeVibeId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleVibeClick(preset)}
                    style={{ '--stagger-index': index } as React.CSSProperties}
                    className={`chip-stagger-in px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-tint)]/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            key="text-budgets"
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-medium text-[var(--ink-secondary)] mr-1">
              Batas harga:
            </span>
            {BUDGET_CAP_PRESETS.map((preset) => {
              const isSelected = maxPrice === preset.maxPrice;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleBudgetPreset(preset.maxPrice)}
                  className={`font-mono-tabular px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--ink-primary)] border-[var(--ink-primary)] text-white'
                      : 'bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Expandable Facilities Tray */}
        {isFacilitiesOpen && (
          <div className="pt-3 border-t border-[var(--border-stone)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--ink-primary)]">
                Filter Fasilitas
              </span>
              {selectedFacilities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFacilities([])}
                  className="text-[var(--accent-primary)] font-medium hover:underline cursor-pointer"
                >
                  Hapus pilihan
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {facilityChips.map((facility) => {
                const selected = selectedFacilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => handleFacilityToggle(facility)}
                    aria-pressed={selected}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                    }`}
                  >
                    {facility}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Live SPK Weight Tuner */}
        {showSpkTuner && isTunerOpen && spkWeights && onSpkWeightsChange && (
          <div className="pt-4 border-t border-[var(--border-stone)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(
              [
                { key: 'price', label: 'Harga' },
                { key: 'location', label: 'Lokasi' },
                { key: 'facilities', label: 'Fasilitas' },
                { key: 'rating', label: 'Rating' },
              ] as const
            ).map((item) => {
              const pct = Math.round((spkWeights[item.key] / totalWeight) * 100);
              return (
                <div
                  key={item.key}
                  className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3"
                >
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <label
                      htmlFor={`prod-spk-${item.key}`}
                      className="font-semibold text-[var(--ink-primary)]"
                    >
                      {item.label}
                    </label>
                    <span className="font-mono-tabular font-semibold text-[var(--accent-primary)]">
                      {pct}%
                    </span>
                  </div>
                  <input
                    id={`prod-spk-${item.key}`}
                    type="range"
                    min={5}
                    max={80}
                    step={5}
                    value={spkWeights[item.key]}
                    onChange={(e) =>
                      onSpkWeightsChange({
                        ...spkWeights,
                        [item.key]: Number(e.target.value),
                      })
                    }
                    className="tactile-slider"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
