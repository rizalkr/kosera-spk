import React from 'react';
import clsx from 'clsx';

export interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 'md',
}) => {
  return (
    <div
      className="inline-flex items-center gap-0.5"
      aria-label={`Rating: ${rating} dari 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <svg
            key={i}
            className={clsx(
              sizeMap[size],
              filled ? 'text-[var(--accent-spark)]' : 'text-[var(--border-stone)]'
            )}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
};
