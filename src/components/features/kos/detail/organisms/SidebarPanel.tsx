'use client';

import React from 'react';
import { formatRupiah } from '@/lib/utils/discovery';
import { OwnerInfoCard } from '../molecules/OwnerInfoCard';
import { LocationCard } from '../molecules/LocationCard';
import { QuickStatsCard } from '../molecules/QuickStatsCard';

const DURATION_OPTIONS = [1, 3, 6, 12] as const;

export interface SidebarPanelProps {
  owner?: { name?: string; contact?: string };
  latitude?: number;
  longitude?: number;
  address: string;
  city: string;
  viewCount: number;
  favoriteCount: number;
  reviewCount: number;
  price?: number;
  kosId?: number;
  kosName?: string;
  averageRating?: number;
  availableRooms?: number;
  totalRooms?: number;
  isFavorited?: boolean;
  isAuthenticated?: boolean;
  isCompared?: boolean;
  compareDisabled?: boolean;
  selectedDuration?: number;
  onDurationChange?: (months: number) => void;
  onOpenBooking?: () => void;
  onToggleFavorite?: () => void;
  onToggleCompare?: () => void;
  showLocationInSidebar?: boolean;
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({
  owner,
  latitude,
  longitude,
  address,
  city,
  viewCount,
  favoriteCount,
  reviewCount,
  price,
  kosId,
  kosName,
  averageRating,
  availableRooms,
  totalRooms,
  isFavorited = false,
  isAuthenticated = false,
  isCompared = false,
  compareDisabled = false,
  selectedDuration = 1,
  onDurationChange,
  onOpenBooking,
  onToggleFavorite,
  onToggleCompare,
  showLocationInSidebar = false,
}) => {
  const showDecisionCard =
    typeof price === 'number' && typeof onOpenBooking === 'function';
  const estimatedTotal =
    typeof price === 'number' ? price * selectedDuration : 0;

  return (
    <div className="space-y-4">
      {showDecisionCard && typeof price === 'number' && (
        <div className="rounded-[16px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] p-5 sm:p-6 space-y-5">
          {/* Price Header */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--border-stone)]">
            <div>
              <div className="font-mono-tabular text-2xl font-bold text-[var(--ink-primary)]">
                {formatRupiah(price)}
              </div>
              <div className="text-xs text-[var(--ink-secondary)] mt-0.5">
                per bulan
                {typeof availableRooms === 'number' &&
                  typeof totalRooms === 'number' &&
                  totalRooms > 0 && (
                    <>
                      {' · '}
                      <span className="font-mono-tabular font-semibold text-[var(--accent-primary)]">
                        {availableRooms} dari {totalRooms} kamar tersedia
                      </span>
                    </>
                  )}
              </div>
            </div>

            {typeof averageRating === 'number' && averageRating > 0 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-stone)] text-xs font-semibold shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-[var(--accent-spark)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-mono-tabular text-[var(--ink-primary)]">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Stay Duration Switcher */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[var(--ink-primary)]">
              Estimasi Durasi Sewa
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((months) => {
                const isSelected = selectedDuration === months;
                return (
                  <button
                    key={months}
                    type="button"
                    onClick={() => onDurationChange?.(months)}
                    className={`font-mono-tabular py-2 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--ink-primary)] border-[var(--ink-primary)] text-white'
                        : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                    }`}
                  >
                    {months} bln
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-stone)] text-xs">
              <span className="text-[var(--ink-secondary)]">
                Total ({selectedDuration} bulan)
              </span>
              <span className="font-mono-tabular text-sm font-bold text-[var(--ink-primary)]">
                {formatRupiah(estimatedTotal)}
              </span>
            </div>
          </div>

          {/* Primary Booking CTA & Secondary Save/Compare Actions */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full py-3 px-4 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              {isAuthenticated ? 'Booking Sekarang' : 'Login untuk Booking'}
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  aria-pressed={isFavorited}
                  className={`py-2.5 px-3 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'bg-[var(--accent-spark-tint)] border-[var(--accent-spark)]/40 text-[var(--accent-spark)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                  }`}
                >
                  {isFavorited ? 'Tersimpan' : 'Simpan'}
                </button>
              )}

              {onToggleCompare && (
                <button
                  type="button"
                  onClick={onToggleCompare}
                  disabled={!isCompared && compareDisabled}
                  aria-pressed={isCompared}
                  className={`py-2.5 px-3 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                    isCompared
                      ? 'bg-[var(--accent-tint)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                  }`}
                >
                  {isCompared ? 'Dibandingkan' : '+ Bandingkan'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <OwnerInfoCard owner={owner} kosName={kosName} />

      {showLocationInSidebar && latitude && longitude && (
        <LocationCard
          address={address}
          city={city}
          latitude={latitude}
          longitude={longitude}
          kosId={kosId}
          kosName={kosName}
          price={price}
        />
      )}

      <QuickStatsCard
        viewCount={viewCount}
        favoriteCount={favoriteCount}
        reviewCount={reviewCount}
      />
    </div>
  );
};
