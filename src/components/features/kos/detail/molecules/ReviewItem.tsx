import React from 'react';
import { RatingStars } from '../atoms/RatingStars';

export interface ReviewItemProps {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
  reviewerName?: string | null;
  reviewTimeText?: string | null;
  formatDate: (date: string) => string;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  id,
  rating,
  comment,
  createdAt,
  user,
  reviewerName,
  reviewTimeText,
  formatDate,
}) => {
  const displayName = reviewerName || user.name || 'Penghuni';
  const displayTime = reviewTimeText || formatDate(createdAt);
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      key={id}
      className="pb-4 border-b border-[var(--border-stone)] last:border-b-0 last:pb-0 space-y-2.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-[var(--bg-muted)] text-[var(--ink-primary)] text-xs font-bold flex items-center justify-center shrink-0"
          >
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--ink-primary)] truncate">
              {displayName}
            </div>
            <div className="text-xs text-[var(--ink-secondary)]">
              {displayTime}
            </div>
          </div>
        </div>
        <RatingStars rating={rating} size="sm" />
      </div>
      <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
        {comment}
      </p>
    </div>
  );
};
