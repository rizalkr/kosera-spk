'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProductionMorphingSearchBar from '@/components/ui/ProductionMorphingSearchBar';
import { KosList } from '@/components/ui/KosList';
import type { SearchMode } from '@/components/ui/SearchModeToggle';
import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';
import MapSection from '@/components/features/maps/MapSection';
import type { MapKosMarkerItem } from '@/components/features/maps/RealMap';
import { useAIServiceStatus, useSemanticSearch } from '@/hooks/ai';
import { useFavorites } from '@/hooks/useApi';
import type { FavoriteKos, PublicKosData, SearchParams } from '@/types';

export default function DaftarKosPage() {
  const [filters, setFilters] = useState<SearchParams>({});
  const [searchMode, setSearchMode] = useState<SearchMode>('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [hoveredKosId, setHoveredKosId] = useState<number | null>(null);
  const [textItems, setTextItems] = useState<PublicKosData[]>([]);
  const [textTotal, setTextTotal] = useState<number | undefined>(undefined);

  const { isOnline: isAIOnline } = useAIServiceStatus();

  const {
    results: semanticResults,
    total: semanticTotal,
    isLoading: isSemanticLoading,
    search: doSemanticSearch,
    clearSearch,
  } = useSemanticSearch();

  const { data: favoritesData } = useFavorites();
  const favoriteKosIds = useMemo(
    () =>
      new Set(
        favoritesData?.data?.favorites?.map((fav: FavoriteKos) => fav.kos.id) ??
          []
      ),
    [favoritesData]
  );

  const handleFilter = useCallback(
    (newFilters: SearchParams) => {
      setFilters(newFilters);
      const nextQuery = newFilters.search || '';
      setSearchQuery(nextQuery);

      if (searchMode === 'ai') {
        if (nextQuery.trim()) {
          doSemanticSearch(nextQuery, {
            city: newFilters.city,
            minPrice: newFilters.minPrice,
            maxPrice: newFilters.maxPrice,
            facilities: newFilters.facilities,
          });
        } else {
          clearSearch();
        }
      }
    },
    [searchMode, doSemanticSearch, clearSearch]
  );

  const handleModeChange = useCallback(
    (mode: SearchMode) => {
      setSearchMode(mode);

      if (mode === 'ai' && searchQuery.trim()) {
        doSemanticSearch(searchQuery, {
          city: filters.city,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          facilities: filters.facilities,
        });
      } else if (mode === 'text') {
        clearSearch();
      }
    },
    [searchQuery, filters, doSemanticSearch, clearSearch]
  );

  const handleTextItemsChange = useCallback(
    (items: PublicKosData[], total: number) => {
      setTextItems(items);
      setTextTotal(total);
    },
    []
  );

  useEffect(() => {
    if (!isAIOnline && searchMode === 'ai') {
      setSearchMode('text');
    }
  }, [isAIOnline, searchMode]);

  const isAIModeActive = searchMode === 'ai' && Boolean(searchQuery.trim());

  const activeMapItems: MapKosMarkerItem[] = useMemo(() => {
    if (isAIModeActive) {
      return semanticResults.map((kos) => ({
        id: kos.id,
        name: kos.name,
        price: kos.price,
        address: kos.address,
        city: kos.city,
        averageRating: kos.averageRating,
        reviewCount: kos.reviewCount,
      }));
    }
    return textItems.map((kos) => ({
      id: kos.id,
      name: kos.name,
      price: kos.price,
      address: kos.address,
      city: kos.city,
      latitude: kos.latitude,
      longitude: kos.longitude,
      averageRating: kos.averageRating,
      reviewCount: kos.reviewCount,
    }));
  }, [isAIModeActive, semanticResults, textItems]);

  const cardGridClass = showMap
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5';

  const renderListings = () => {
    if (isAIModeActive) {
      if (isSemanticLoading) {
        return (
          <div className={cardGridClass}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-[var(--bg-muted)]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[var(--bg-muted)] rounded w-2/3" />
                  <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (semanticResults.length === 0) {
        return (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-12 text-center space-y-3">
            <svg
              className="w-10 h-10 mx-auto text-[var(--ink-secondary)]"
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
            <h3 className="text-base font-bold text-[var(--ink-primary)]">
              Tidak ada kos yang cocok dengan pencarian AI
            </h3>
            <p className="text-sm text-[var(--ink-secondary)]">
              Coba ubah kata kunci atau beralih ke mode Filter Pencarian.
            </p>
            <button
              type="button"
              onClick={() => handleModeChange('text')}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              Beralih ke Filter Pencarian
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--ink-secondary)]">
            <span>
              Ditemukan{' '}
              <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                {semanticTotal}
              </span>{' '}
              kos relevan berdasarkan pencarian AI
            </span>
          </div>

          <div className={cardGridClass}>
            {semanticResults.map((kos) => {
              const primaryPhoto =
                kos.photos?.find((p) => p.isPrimary)?.url ||
                kos.photos?.[0]?.url;

              return (
                <UnifiedKosCard
                  key={kos.id}
                  id={kos.id}
                  name={kos.name}
                  description={kos.description}
                  price={kos.price}
                  address={kos.address}
                  city={kos.city}
                  imageUrl={primaryPhoto}
                  rating={parseFloat(kos.averageRating || '0')}
                  reviewCount={kos.reviewCount}
                  facilities={kos.facilities ? kos.facilities.split(',') : []}
                  availableRooms={kos.availableRooms}
                  totalRooms={kos.totalRooms}
                  aiSimilarity={kos.similarity}
                  isFavorite={favoriteKosIds.has(kos.id)}
                  isHighlighted={hoveredKosId === kos.id}
                  onHoverChange={setHoveredKosId}
                />
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <KosList
        initialFilters={filters}
        columns={showMap ? 2 : 3}
        hoveredKosId={hoveredKosId}
        onHoverChange={setHoveredKosId}
        onItemsChange={handleTextItemsChange}
      />
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--ink-primary)] pt-16 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-28 space-y-8">
        {/* Page Header + Map Visibility Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[var(--ink-primary)]">
              Daftar Kos Semarang
            </h1>
            <p className="text-sm sm:text-base text-[var(--ink-secondary)]">
              Bandingkan fasilitas, harga bulanan, dan lokasi di sekitar kampus
              pilihanmu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            aria-pressed={showMap}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors self-start sm:self-auto cursor-pointer"
          >
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
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span>{showMap ? 'Sembunyikan Peta' : 'Tampilkan Peta'}</span>
          </button>
        </div>

        {/* Unified Morphing Search & Filter */}
        <ProductionMorphingSearchBar
          mode={searchMode}
          onModeChange={handleModeChange}
          isAIOnline={isAIOnline}
          initialFilters={filters}
          onFilter={handleFilter}
          resultCount={isAIModeActive ? semanticTotal : textTotal}
          isLoading={isSemanticLoading}
        />

        {/* Split Map + List OR Full 3-Col Grid */}
        {showMap ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">{renderListings()}</div>
            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <MapSection
                kosItems={activeMapItems}
                activeKosId={hoveredKosId}
                onHoverKos={setHoveredKosId}
                heightClassName="h-[420px]"
              />
            </div>
          </div>
        ) : (
          renderListings()
        )}
      </main>

      <Footer />
    </div>
  );
}
