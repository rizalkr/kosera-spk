import React from 'react';
import { RatingStars } from '../atoms/RatingStars';
import { ReviewItem } from '../molecules/ReviewItem';

export interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string; username?: string };
  reviewerName?: string | null;
  reviewTimeText?: string | null;
}

export interface ReviewsSectionProps {
  totalReviews: number;
  averageRating?: string | number;
  reviews: ReviewData[];
  hasNext: boolean;
  formatDate: (date: string) => string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  totalReviews,
  averageRating,
  reviews,
  hasNext,
  formatDate,
}) => {
  const avgNum =
    averageRating !== undefined ? Number(averageRating) : undefined;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--ink-primary)]">
          Ulasan Penghuni{' '}
          <span className="font-mono-tabular text-[var(--ink-secondary)] font-semibold">
            ({totalReviews})
          </span>
        </h2>
        {avgNum !== undefined && Number.isFinite(avgNum) && avgNum > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-stone)]">
            <RatingStars rating={Math.round(avgNum)} size="sm" />
            <span className="font-mono-tabular text-xs font-bold text-[var(--ink-primary)]">
              {avgNum.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="rounded-[16px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-5 space-y-4">
          {reviews.map((r) => (
            <ReviewItem
              key={r.id}
              id={r.id}
              rating={r.rating}
              comment={r.comment}
              createdAt={r.createdAt}
              user={r.user}
              reviewerName={r.reviewerName}
              reviewTimeText={r.reviewTimeText}
              formatDate={formatDate}
            />
          ))}
          {hasNext && (
            <button
              type="button"
              className="text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
            >
              Lihat semua ulasan
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-[16px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] py-10 px-6 text-center space-y-2">
          <svg
            className="w-8 h-8 mx-auto text-[var(--ink-secondary)]"
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
          <p className="text-sm font-medium text-[var(--ink-primary)]">
            Belum ada ulasan untuk kos ini
          </p>
          <p className="text-xs text-[var(--ink-secondary)]">
            Jadilah penghuni pertama yang membagikan pengalaman tinggal.
          </p>
        </div>
      )}
    </section>
  );
};
