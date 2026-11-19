'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

export interface FavoriteButtonProps {
  isFavorited: boolean;
  onClick: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorited,
  onClick,
}) => {
  const [burst, setBurst] = useState(false);

  const handleClick = () => {
    setBurst(true);
    onClick();
    window.setTimeout(() => setBurst(false), 480);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'w-11 h-11 rounded-[10px] border inline-flex items-center justify-center transition-colors cursor-pointer',
        isFavorited
          ? 'bg-[var(--accent-spark-tint)] border-[var(--accent-spark)]/40 text-[var(--accent-spark)]'
          : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--accent-spark)] hover:border-[var(--accent-spark)]/40'
      )}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
    >
      <svg
        className={clsx('w-5 h-5', burst && 'heart-spring-burst')}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
};
