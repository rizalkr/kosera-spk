'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';
import { useFavorites, useKosSearch } from '@/hooks/useApi';
import type { FavoriteKos, PublicKosData, SearchParams } from '@/types';
import { Pagination } from './Pagination';

interface KosListProps {
  initialFilters?: SearchParams;
  hoveredKosId?: number | null;
  onHoverChange?: (id: number | null) => void;
  columns?: 2 | 3;
  onItemsChange?: (items: PublicKosData[], total: number) => void;
}

/**
 * KosList - Displays paginated boarding house listings using UnifiedKosCard
 * and /api/kos/search.
 */
export const KosList = ({
  initialFilters = {},
  hoveredKosId = null,
  onHoverChange,
  columns = 2,
  onItemsChange,
}: KosListProps) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [initialFilters]);

  const searchParams = useMemo(
    () => ({
      ...initialFilters,
      search: initialFilters.search || '',
      page,
      limit: 12,
    }),
    [initialFilters, page]
  );

  const { data, isLoading, error, refetch } = useKosSearch(searchParams);
  const { data: favoritesData } = useFavorites();

  const favoriteKosIds = useMemo(() => {
    if (!favoritesData?.data?.favorites) return new Set<number>();
    return new Set(
      favoritesData.data.favorites.map((fav: FavoriteKos) => fav.kos.id)
    );
  }, [favoritesData]);

  const kosList = useMemo(() => {
    if (!data?.data?.results) return [];
    return data.data.results as PublicKosData[];
  }, [data]);

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalResults = pagination?.total || kosList.length;

  useEffect(() => {
    onItemsChange?.(kosList, totalResults);
  }, [kosList, totalResults, onItemsChange]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const gridClass =
    columns === 3
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
      : 'grid grid-cols-1 sm:grid-cols-2 gap-5';

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] w-full bg-[var(--bg-muted)]" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-[var(--bg-muted)] rounded w-1/3" />
              <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4" />
              <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
              <div className="pt-3 border-t border-[var(--border-stone)] flex justify-between">
                <div className="h-5 bg-[var(--bg-muted)] rounded w-24" />
                <div className="h-7 bg-[var(--bg-muted)] rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-8 text-center space-y-3">
        <p className="text-sm font-medium text-[var(--accent-danger)]">
          Gagal memuat data kos. Silakan coba lagi.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (kosList.length === 0) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-12 text-center space-y-2">
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
          Tidak ada kos ditemukan
        </h3>
        <p className="text-sm text-[var(--ink-secondary)]">
          Coba longgarkan filter harga, kecamatan, atau fasilitas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--ink-secondary)]">
        <span>
          Menampilkan{' '}
          <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
            {kosList.length}
          </span>{' '}
          dari{' '}
          <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
            {totalResults}
          </span>{' '}
          kos
        </span>
      </div>

      <div className={gridClass}>
        {kosList.map((kos) => {
          const primaryPhoto =
            kos.photos?.find((photo) => photo.isPrimary)?.url ||
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
              onHoverChange={onHoverChange}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="space-y-3">
          <div className="flex flex-wrap justify-center items-center gap-1.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`font-mono-tabular w-9 h-9 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
                    page === pageNum
                      ? 'bg-[var(--ink-primary)] border-[var(--ink-primary)] text-white'
                      : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default KosList;
