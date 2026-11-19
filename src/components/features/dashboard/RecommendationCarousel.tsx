'use client';

import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import UnifiedKosCard from '@/components/molecules/UnifiedKosCard';
import { useFavorites, useKosFeatured } from '@/hooks/useApi';
import type { FavoriteKos, PublicKosData } from '@/types';

export default function RecommendationCarousel() {
  const { data, isLoading, error } = useKosFeatured();
  const { data: favoritesData } = useFavorites();

  const favoriteKosIds = useMemo(() => {
    if (!favoritesData?.data?.favorites) return new Set<number>();
    return new Set(
      favoritesData.data.favorites.map((fav: FavoriteKos) => fav.kos.id)
    );
  }, [favoritesData]);

  if (isLoading) {
    return (
      <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--ink-primary)]">
            Sorotan Pilihan
          </h3>
          <span className="font-mono-tabular text-xs text-[var(--ink-secondary)]">
            Memuat
          </span>
        </div>
        <div className="animate-pulse rounded-[16px] border border-[var(--border-stone)] overflow-hidden">
          <div className="aspect-[4/3] w-full bg-[var(--bg-muted)]" />
          <div className="p-4 space-y-2.5">
            <div className="h-4 bg-[var(--bg-muted)] rounded w-2/3" />
            <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 space-y-2">
        <h3 className="text-sm font-bold text-[var(--ink-primary)]">
          Sorotan Pilihan
        </h3>
        <p className="text-xs text-[var(--accent-danger)]">
          Gagal memuat sorotan kos saat ini.
        </p>
      </section>
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
  const envelope: LegacyShape | NewShape | undefined =
    data && typeof data === 'object'
      ? (data as LegacyShape | NewShape)
      : undefined;

  const recommendations: PublicKosData[] = Array.isArray(
    (envelope as LegacyShape)?.data
  )
    ? ((envelope as LegacyShape).data as PublicKosData[])
    : Array.isArray((envelope as NewShape)?.data?.items)
      ? ((envelope as NewShape).data?.items as PublicKosData[])
      : [];

  if (recommendations.length === 0) {
    return (
      <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 space-y-2">
        <h3 className="text-sm font-bold text-[var(--ink-primary)]">
          Sorotan Pilihan
        </h3>
        <p className="text-xs text-[var(--ink-secondary)]">
          Belum ada sorotan kos tersedia.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Sorotan Pilihan"
      className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--ink-primary)]">
            Sorotan Pilihan
          </h3>
          <p className="text-xs text-[var(--ink-secondary)]">
            Geser untuk melihat kos unggulan
          </p>
        </div>
        <span className="font-mono-tabular text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-muted)] text-[var(--ink-secondary)]">
          {recommendations.length} kos
        </span>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        loop={recommendations.length > 1}
        autoplay={recommendations.length > 1 ? { delay: 5000 } : false}
      >
        {recommendations.map((kos: PublicKosData) => {
          const primaryPhoto =
            kos.photos?.find((photo) => photo.isPrimary)?.url ||
            kos.photos?.[0]?.url;
          const availableRooms =
            typeof kos.totalRooms === 'number'
              ? Math.max(0, kos.totalRooms - (kos.occupiedRooms ?? 0))
              : undefined;

          return (
            <SwiperSlide key={kos.id}>
              <UnifiedKosCard
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
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
