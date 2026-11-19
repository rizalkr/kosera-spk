'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onImageChange: (index: number) => void;
  kosName: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onImageChange,
  kosName,
}: ImageModalProps) {
  const [imageIndex, setImageIndex] = useState(currentIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const safeImages =
    images.length > 0 ? images : ['/images/rooms/room1.jpg'];

  const handlePrevious = useCallback(() => {
    const newIndex = imageIndex > 0 ? imageIndex - 1 : safeImages.length - 1;
    setImageIndex(newIndex);
    onImageChange(newIndex);
  }, [imageIndex, safeImages.length, onImageChange]);

  const handleNext = useCallback(() => {
    const newIndex = imageIndex < safeImages.length - 1 ? imageIndex + 1 : 0;
    setImageIndex(newIndex);
    onImageChange(newIndex);
  }, [imageIndex, safeImages.length, onImageChange]);

  useEffect(() => {
    setImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    setIsZoomed(false);
  }, [imageIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsZoomed((prev) => !prev);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleNext, handlePrevious, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri foto ${kosName}`}
      className="fixed inset-0 bg-[#181A18]/92 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsZoomed((prev) => !prev)}
          className="w-10 h-10 rounded-[10px] bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
          aria-label={isZoomed ? 'Perkecil foto' : 'Perbesar foto'}
          title={isZoomed ? 'Zoom out (Z)' : 'Zoom in (Z)'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            {isZoomed ? (
              <line x1="8" y1="11" x2="14" y2="11" />
            ) : (
              <>
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </>
            )}
          </svg>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-[10px] bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Tutup galeri"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Main Image Frame */}
      <div
        className={`relative max-w-4xl max-h-full w-full h-full flex items-center justify-center transition-transform duration-300 ${
          isZoomed ? 'scale-125' : ''
        }`}
      >
        <div className="relative w-full h-full max-h-[76vh] flex items-center justify-center">
          <Image
            src={safeImages[imageIndex] || '/images/rooms/room1.jpg'}
            alt={`${kosName} - Foto ${imageIndex + 1}`}
            width={1000}
            height={750}
            className={`max-w-full max-h-full object-contain rounded-[14px] ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed((prev) => !prev)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/rooms/room1.jpg';
            }}
          />
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Foto sebelumnya"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white/25 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Foto selanjutnya"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-xl px-4">
        {safeImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto max-w-full py-1 px-2">
            {safeImages.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setImageIndex(index);
                  onImageChange(index);
                }}
                aria-label={`Pilih foto ${index + 1}`}
                className={`relative w-14 h-14 rounded-[10px] overflow-hidden shrink-0 border-2 transition-opacity cursor-pointer ${
                  index === imageIndex
                    ? 'border-[var(--accent-primary)] opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/images/rooms/room${(index % 4) + 1}.jpg`;
                  }}
                />
              </button>
            ))}
          </div>
        )}

        <div className="bg-black/60 border border-white/15 text-white px-4 py-1.5 rounded-full text-center">
          <span className="font-mono-tabular text-xs font-semibold">
            {imageIndex + 1} / {safeImages.length}
          </span>
          <span className="hidden sm:inline text-xs text-white/75 ml-3">
            Klik foto atau Z untuk zoom · Panah Kiri/Kanan · ESC untuk tutup
          </span>
        </div>
      </div>
    </div>
  );
}
