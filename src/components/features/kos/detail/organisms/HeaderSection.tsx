import React from 'react';
import { RatingStars } from '../atoms/RatingStars';
import { FavoriteButton } from '../atoms/FavoriteButton';
import { PriceTag } from '../atoms/PriceTag';

export interface HeaderSectionProps {
  name: string;
  address: string;
  city: string;
  price?: number;
  averageRating?: string | number;
  totalReviews?: number;
  viewCount: number;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onOpenBooking: () => void;
  isAuthenticated: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  name,
  address,
  city,
  price = 0,
  averageRating,
  totalReviews = 0,
  viewCount,
  isFavorited,
  onToggleFavorite,
  onOpenBooking,
  isAuthenticated,
}) => {
  const avgNum =
    averageRating !== undefined ? Number(averageRating) : undefined;

  return (
    <div className="pb-6 border-b border-[var(--border-stone)] flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
          {name}
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-secondary)]">
          {address}, {city}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--ink-secondary)]">
          {avgNum !== undefined && Number.isFinite(avgNum) && avgNum > 0 && (
            <div className="inline-flex items-center gap-1.5">
              <RatingStars rating={Math.round(avgNum)} size="sm" />
              <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                {avgNum.toFixed(1)}
              </span>
              <span>({totalReviews} ulasan)</span>
            </div>
          )}
          <span className="font-mono-tabular">{viewCount} dilihat</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <FavoriteButton
          isFavorited={isFavorited}
          onClick={onToggleFavorite}
        />
        <div className="text-right space-y-2">
          {price > 0 && <PriceTag price={price} />}
          <button
            type="button"
            onClick={onOpenBooking}
            className="bg-[var(--accent-primary)] text-white px-5 py-2.5 rounded-[10px] hover:bg-[var(--accent-primary-hover)] transition-colors text-xs sm:text-sm font-semibold cursor-pointer"
          >
            {isAuthenticated ? 'Booking Sekarang' : 'Login untuk Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
