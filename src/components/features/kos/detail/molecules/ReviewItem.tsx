import React from 'react';
import { RatingStars } from '../atoms/RatingStars';

export interface ReviewItemProps {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
  reviewerName?: string | null; // Original reviewer name from scraping
  reviewTimeText?: string | null; // Original time text (e.g., "5 bulan lalu")
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
  formatDate 
}) => {
  // Use reviewerName from scraping if available, otherwise use user.name
  const displayName = reviewerName || user.name;
  // Use reviewTimeText from scraping if available, otherwise format createdAt
  const displayTime = reviewTimeText || formatDate(createdAt);

  return (
    <div key={id} className="border-b border-gray-200 pb-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-gray-800">{displayName}</div>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={rating} size="sm" />
            <span className="text-sm text-gray-500">{displayTime}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600">{comment}</p>
    </div>
  );
};
