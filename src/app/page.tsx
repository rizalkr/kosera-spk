'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProductionMorphingSearchBar from '@/components/ui/ProductionMorphingSearchBar';
import FeaturedList from '@/components/ui/FeaturedList';
import MapSection from '@/components/features/maps/MapSection';
import type { MapKosMarkerItem } from '@/components/features/maps/RealMap';
import RecommendationCarousel from '@/components/features/dashboard/RecommendationCarousel';
import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';
import type { SearchMode } from '@/components/ui/SearchModeToggle';
import { useAIServiceStatus, useSemanticSearch } from '@/hooks/ai';
import {
  useFavorites,
  useKosFeatured,
  useKosSearch,
} from '@/hooks/useApi';
import type { FavoriteKos, PublicKosData, SearchParams } from '@/types';

function extractFeaturedItems(data: unknown): PublicKosData[] {
  if (!data || typeof data !== 'object') return [];
  const record = data as {
    data?: PublicKosData[] | { items?: PublicKosData[] };
  };
  if (Array.isArray(record.data)) {
    return record.data;
  }
  if (record.data && Array.isArray(record.data.items)) {
    return record.data.items;
  }
  return [];
}

export default function HomePage() {
  const [searchMode, setSearchMode] = useState<SearchMode>('text');
  const [searchFilters, setSearchFilters] = useState<SearchParams>({});
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredKosId, setHoveredKosId] = useState<number | null>(null);

  const { isOnline: isAIOnline } = useAIServiceStatus();
  const {
    results: semanticResults,
    isLoading: isSemanticLoading,
    search: doSemanticSearch,
    clearSearch,
  } = useSemanticSearch();

  const textQueryParams = useMemo(
    () => (searchMode === 'text' ? searchFilters : {}),
    [searchMode, searchFilters]
  );
  const { data: searchResults, isLoading: isSearchLoading } =
    useKosSearch(textQueryParams);
  const { data: featuredData } = useKosFeatured();
  const { data: favoritesData } = useFavorites();

  const favoriteKosIds = useMemo(() => {
    if (!favoritesData?.data?.favorites) return new Set<number>();
    return new Set(
      favoritesData.data.favorites.map((fav: FavoriteKos) => fav.kos.id)
    );
  }, [favoritesData]);

  useEffect(() => {
    if (!isAIOnline && searchMode === 'ai') {
      setSearchMode('text');
    }
  }, [isAIOnline, searchMode]);

  const handleFilter = useCallback(
    (filters: SearchParams) => {
      setSearchFilters(filters);
      const hasQuery = Object.keys(filters).length > 0;
      setIsSearching(hasQuery);

      if (searchMode === 'ai') {
        if (filters.search && filters.search.trim()) {
          doSemanticSearch(filters.search, {
            city: filters.city,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            facilities: filters.facilities,
          });
        } else {
          clearSearch();
        }
      }
    },
    [searchMode, doSemanticSearch, clearSearch]
  );

  const handleModeChange = useCallback(
    (nextMode: SearchMode) => {
      setSearchMode(nextMode);
      if (nextMode === 'ai' && searchFilters.search?.trim()) {
        doSemanticSearch(searchFilters.search, {
          city: searchFilters.city,
          minPrice: searchFilters.minPrice,
          maxPrice: searchFilters.maxPrice,
          facilities: searchFilters.facilities,
        });
      } else if (nextMode === 'text') {
        clearSearch();
      }
    },
    [searchFilters, doSemanticSearch, clearSearch]
  );

  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
    setIsSearching(false);
    clearSearch();
  }, [clearSearch]);

  const featuredItems = useMemo(
    () => extractFeaturedItems(featuredData),
    [featuredData]
  );

  const textSearchList = useMemo(
    () => (searchResults?.data?.results as PublicKosData[]) || [],
    [searchResults]
  );

  const isAIModeActive =
    searchMode === 'ai' && Boolean(searchFilters.search?.trim());

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

    const source = isSearching ? textSearchList : featuredItems;
    return source.map((kos) => ({
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
  }, [isAIModeActive, semanticResults, isSearching, textSearchList, featuredItems]);

  const activeResultCount = isAIModeActive
    ? semanticResults.length
    : isSearching
      ? textSearchList.length
      : undefined;

  const renderPrimaryDiscovery = () => {
    if (isAIModeActive) {
      if (isSemanticLoading) {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-10 text-center space-y-3">
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
              Belum ada kos yang sesuai dengan deskripsi AI
            </h3>
            <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto">
              Coba kalimat pencarian lain atau kembali ke semua kos pilihan.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              Lihat semua kos pilihan
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
              Hasil Pencarian AI{' '}
              <span className="font-mono-tabular text-base font-semibold text-[var(--accent-primary)]">
                ({semanticResults.length})
              </span>
            </h2>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
            >
              Reset pencarian
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

    if (isSearching && isSearchLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

    if (isSearching && searchResults) {
      if (textSearchList.length === 0) {
        return (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-10 text-center space-y-3">
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h3 className="text-base font-bold text-[var(--ink-primary)]">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-sm text-[var(--ink-secondary)]">
              Coba ubah kata kunci, kecamatan, atau batas harga pencarian Anda.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              Lihat semua kos
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
              Hasil Pencarian{' '}
              <span className="font-mono-tabular text-base font-semibold text-[var(--accent-primary)]">
                ({textSearchList.length})
              </span>
            </h2>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
            >
              Lihat kos pilihan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {textSearchList.map((kos: PublicKosData) => {
              const primaryPhoto =
                kos.photos?.find((p) => p.isPrimary)?.url ||
                kos.photos?.[0]?.url;
              const availableRooms =
                typeof kos.totalRooms === 'number'
                  ? Math.max(0, kos.totalRooms - (kos.occupiedRooms ?? 0))
                  : undefined;

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
                  availableRooms={availableRooms}
                  totalRooms={kos.totalRooms}
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
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
              Kos Pilihan Utama
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-0.5">
              Rekomendasi hunian terkurasi di sekitar kampus Semarang.
            </p>
          </div>
          <Link
            href="/list"
            className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline shrink-0"
          >
            Lihat semua
          </Link>
        </div>
        <FeaturedList
          hoveredKosId={hoveredKosId}
          onHoverChange={setHoveredKosId}
        />
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--ink-primary)] pt-16 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-28 space-y-10">
        {/* Editorial Hero + Unified Discovery Search */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08] text-[var(--ink-primary)]">
                Temukan ruang kos yang pas dengan ritmemu.
              </h1>
              <p className="text-base sm:text-lg text-[var(--ink-secondary)] leading-[1.58]">
                Cari kos di Semarang dengan filter cerdas, pencarian bahasa
                natural AI, perbandingan berdampingan, dan skor kecocokan SPK.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/list"
                className="px-4 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors"
              >
                Jelajahi Semua Kos
              </Link>
              <Link
                href="/recommendations"
                className="px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                Rekomendasi SPK
              </Link>
            </div>
          </div>

          <ProductionMorphingSearchBar
            mode={searchMode}
            onModeChange={handleModeChange}
            isAIOnline={isAIOnline}
            initialFilters={searchFilters}
            onFilter={handleFilter}
            resultCount={activeResultCount}
            isLoading={isSearchLoading || isSemanticLoading}
          />
        </section>

        {/* Split Interactive Discovery Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">{renderPrimaryDiscovery()}</div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <MapSection
              kosItems={activeMapItems}
              activeKosId={hoveredKosId}
              onHoverKos={setHoveredKosId}
              heightClassName="h-[340px]"
            />

            <RecommendationCarousel />

            {/* SPK Engine Entry Card */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-5 space-y-3">
              <h3 className="text-base font-bold text-[var(--ink-primary)]">
                Belum yakin memilih?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] leading-relaxed">
                Atur prioritas harga, jarak kampus, fasilitas, dan rating agar
                algoritma Profile Matching menyusun peringkat kos paling sesuai
                untukmu.
              </p>
              <Link
                href="/recommendations"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-[10px] text-xs font-semibold bg-[var(--ink-primary)] text-white hover:bg-[var(--accent-primary)] transition-colors"
              >
                Coba Rekomendasi SPK
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
