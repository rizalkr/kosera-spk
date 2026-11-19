import React from 'react';

export interface QuickStatsCardProps {
  viewCount: number;
  favoriteCount: number;
  reviewCount: number;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  viewCount,
  favoriteCount,
  reviewCount,
}) => (
  <div className="rounded-[16px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-4">
    <div className="grid grid-cols-3 divide-x divide-[var(--border-stone)] text-center">
      <div className="px-2">
        <div className="font-mono-tabular text-base font-bold text-[var(--ink-primary)]">
          {viewCount}
        </div>
        <div className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Dilihat
        </div>
      </div>
      <div className="px-2">
        <div className="font-mono-tabular text-base font-bold text-[var(--ink-primary)]">
          {favoriteCount}
        </div>
        <div className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Favorit
        </div>
      </div>
      <div className="px-2">
        <div className="font-mono-tabular text-base font-bold text-[var(--ink-primary)]">
          {reviewCount}
        </div>
        <div className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Ulasan
        </div>
      </div>
    </div>
  </div>
);
