'use client';

import React from 'react';
import SafeImage from '@/components/ui/SafeImage';

export interface ImageGalleryProps {
  images: string[];
  activeIndex: number;
  onImageClick: (index: number) => void;
  kosName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  activeIndex,
  onImageClick,
  kosName,
}) => {
  const safeImages =
    images.length > 0 ? images : ['/images/rooms/room1.jpg'];
  const mainIndex = activeIndex < safeImages.length ? activeIndex : 0;
  const secondaryIndices = safeImages
    .map((_, idx) => idx)
    .filter((idx) => idx !== mainIndex)
    .slice(0, 2);

  if (safeImages.length <= 1) {
    return (
      <div className="relative w-full aspect-[16/9] max-h-[440px] rounded-[16px] overflow-hidden bg-[var(--bg-muted)]">
        <SafeImage
          src={safeImages[0]}
          alt={kosName}
          width={960}
          height={540}
          className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onClick={() => onImageClick(0)}
          fallbackSrc="/images/rooms/room1.jpg"
        />
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* Dominant Primary Photo */}
      <div className="lg:col-span-7 relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[var(--bg-muted)] group">
        <SafeImage
          src={safeImages[mainIndex]}
          alt={kosName}
          width={840}
          height={630}
          className="w-full h-full object-cover cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onClick={() => onImageClick(mainIndex)}
          fallbackSrc="/images/rooms/room1.jpg"
        />
      </div>

      {/* Stacked Secondary Photos */}
      <div
        className={`lg:col-span-5 grid gap-3 ${
          secondaryIndices.length === 1
            ? 'grid-cols-1'
            : 'grid-cols-2 lg:grid-cols-1 lg:grid-rows-2'
        }`}
      >
        {secondaryIndices.map((imgIdx, slot) => (
          <div
            key={imgIdx}
            className={`relative rounded-[16px] overflow-hidden bg-[var(--bg-muted)] group ${
              secondaryIndices.length === 1
                ? 'aspect-[4/3] lg:aspect-auto lg:h-full'
                : 'aspect-[4/3] lg:aspect-auto'
            }`}
          >
            <SafeImage
              src={safeImages[imgIdx]}
              alt={`${kosName} - Foto ${imgIdx + 1}`}
              width={560}
              height={320}
              className="w-full h-full object-cover cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onClick={() => onImageClick(imgIdx)}
              fallbackSrc={`/images/rooms/room${(slot % 4) + 1}.jpg`}
            />
          </div>
        ))}
      </div>

      {/* Gallery Lightbox Trigger */}
      <button
        type="button"
        onClick={() => onImageClick(mainIndex)}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-xs font-semibold bg-[var(--bg-surface)]/95 border border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 text-[var(--accent-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <span className="font-mono-tabular">
          Lihat semua ({safeImages.length} foto)
        </span>
      </button>
    </div>
  );
};
