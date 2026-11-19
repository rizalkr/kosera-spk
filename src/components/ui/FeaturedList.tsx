'use client';

import { useMemo } from 'react';
import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';
import { useFavorites, useKosFeatured } from '@/hooks/useApi';
import type { FavoriteKos, PublicKosData } from '@/types';

interface FeaturedListProps {
  hoveredKosId?: number | null;
  onHoverChange?: (id: number | null) => void;
}

export default function FeaturedList({
  hoveredKosId = null,
  onHoverChange,
}: FeaturedListProps) {
  const { data, isLoading, error, refetch } = useKosFeatured();
  const { data: favoritesData } = useFavorites();

  const favoriteKosIds = useMemo(() => {
    if (!favoritesData?.data?.favorites) return new Set<number>();
    return new Set(
      favoritesData.data.favorites.map((fav: FavoriteKos) => fav.kos.id)
    );
  }, [favoritesData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
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
          Gagal memuat data kos pilihan. Silakan coba lagi.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  interface LegacyShape {
    success: boolean;
    data?: PublicKosData[];
  }
  interface NewShape {
    success: boolean;
    data?: { items?: PublicKosData[]; count?: number };
  }
  type FeaturedEnvelope = LegacyShape | NewShape;

  const envelope: FeaturedEnvelope | undefined =
    data && typeof data === 'object' ? (data as FeaturedEnvelope) : undefined;

  let kosList: PublicKosData[] = [];
  if (envelope?.data) {
    if (Array.isArray((envelope as LegacyShape).data)) {
      kosList = (envelope as LegacyShape).data ?? [];
    } else if (Array.isArray((envelope as NewShape).data?.items)) {
      kosList = (envelope as NewShape).data?.items ?? [];
    }
  }

  if (kosList.length === 0) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-10 text-center space-y-2">
        <p className="text-base font-semibold text-[var(--ink-primary)]">
          Belum ada kos pilihan tersedia
        </p>
        <p className="text-sm text-[var(--ink-secondary)]">
          Coba telusuri seluruh daftar kos melalui kolom pencarian di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {kosList.map((kos: PublicKosData) => {
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
  );
}
