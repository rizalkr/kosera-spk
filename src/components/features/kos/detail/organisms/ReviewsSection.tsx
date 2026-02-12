import React from 'react';
import { RatingStars } from '../atoms/RatingStars';
import { ReviewItem } from '../molecules/ReviewItem';

export interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string; username?: string };
  reviewerName?: string | null; // Original reviewer name from scraping
  reviewTimeText?: string | null; // Original time text (e.g., "5 bulan lalu")
}

export interface ReviewsSectionProps {
  totalReviews: number;
  averageRating?: string | number;
  reviews: ReviewData[];
  hasNext: boolean;
  formatDate: (date: string) => string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ totalReviews, averageRating, reviews, hasNext, formatDate }) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Ulasan ({totalReviews})
      </h2>
      {averageRating && Number(averageRating) > 0 && (
        <div className="flex items-center gap-2">
          <RatingStars rating={Math.round(Number(averageRating))} />
          <span className="text-gray-600">{Number(averageRating).toFixed(1)}</span>
        </div>
      )}
    </div>

    {reviews.length > 0 ? (
      <div className="space-y-4">
        {reviews.map(r => (
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
          <button className="text-blue-600 hover:underline font-medium">
            Lihat semua ulasan
          </button>
        )}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">💬</div>
        <p>Belum ada ulasan untuk kos ini</p>
      </div>
    )}
  </section>
);
