'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCompare } from '@/contexts/CompareContext';
import { useKosImage } from '@/hooks/image/useKosImage';
import {
  useAddFavorite,
  useRemoveFavorite,
  useTrackView,
} from '@/hooks/useApi';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import {
  formatRupiah,
  normalizeSpkScore,
  parsePriceValue,
} from '@/lib/utils/discovery';

export interface UnifiedKosSpkDetails {
  priceScore: number;
  locationScore: number;
  facilitiesScore: number;
  ratingScore: number;
}

export interface UnifiedKosCardProps {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  address: string;
  city: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  facilities?: string[];
  availableRooms?: number;
  totalRooms?: number;
  distance?: number;
  matchingScore?: number;
  matchingDetails?: UnifiedKosSpkDetails;
  rank?: number;
  isTopMatch?: boolean;
  aiSimilarity?: number;
  isFavorite?: boolean;
  onFavoriteChange?: (kosId: number, nextFavorited: boolean) => void;
  layout?: 'vertical' | 'horizontal';
  isHighlighted?: boolean;
  onHoverChange?: (kosId: number | null) => void;
  showCompareButton?: boolean;
}

const FALLBACK_IMAGE = '/images/rooms/room1.jpg';

export function UnifiedKosCard({
  id,
  name,
  description,
  price,
  address,
  city,
  imageUrl,
  rating,
  reviewCount = 0,
  facilities = [],
  availableRooms,
  totalRooms,
  distance,
  matchingScore,
  matchingDetails,
  rank,
  isTopMatch = false,
  aiSimilarity,
  isFavorite = false,
  onFavoriteChange,
  layout = 'vertical',
  isHighlighted = false,
  onHoverChange,
  showCompareButton = true,
}: UnifiedKosCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorite);
  const [heartBurst, setHeartBurst] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [breakdownPinned, setBreakdownPinned] = useState(false);
  const [breakdownHovered, setBreakdownHovered] = useState(false);

  const { imageUrl: fetchedImageUrl, hasPhotos } = useKosImage(id);
  const trackView = useTrackView();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { executeProtectedAction } = useProtectedAction();
  const { isCompared, toggleCompare, maxReached } = useCompare();

  useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl, fetchedImageUrl]);

  const resolvedImageSrc = imageFailed
    ? FALLBACK_IMAGE
    : imageUrl || fetchedImageUrl || FALLBACK_IMAGE;

  const numericPrice = parsePriceValue(price);
  const compared = isCompared(id);
  const compareDisabled = !compared && maxReached;

  const spkPct =
    typeof matchingScore === 'number'
      ? normalizeSpkScore(matchingScore)
      : null;

  const aiPct =
    typeof aiSimilarity === 'number'
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(aiSimilarity <= 1 ? aiSimilarity * 100 : aiSimilarity)
          )
        )
      : null;

  const showBreakdown = Boolean(matchingDetails) && (breakdownPinned || breakdownHovered);
  const highlightTop = isTopMatch || rank === 1;
  const cleanFacilities = facilities
    .map((item) => item.trim())
    .filter(Boolean);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    executeProtectedAction(
      () => {
        if (isLiked) {
          removeFavorite.mutate(id, {
            onSuccess: () => {
              setIsLiked(false);
              onFavoriteChange?.(id, false);
            },
          });
        } else {
          addFavorite.mutate(id, {
            onSuccess: () => {
              setIsLiked(true);
              setHeartBurst(true);
              onFavoriteChange?.(id, true);
              window.setTimeout(() => setHeartBurst(false), 480);
            },
          });
        }
      },
      {
        message: 'Login untuk menambahkan kos ke favorit',
      }
    );
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare({
      id,
      name,
      address,
      city,
      price: numericPrice,
      imageUrl: resolvedImageSrc,
      averageRating: rating,
      reviewCount,
      facilities: cleanFacilities,
      availableRooms,
      totalRooms,
      distance,
      matchingScore,
      matchingDetails,
    });
  };

  const isHorizontal = layout === 'horizontal';

  return (
    <article
      onMouseEnter={() => onHoverChange?.(id)}
      onMouseLeave={() => onHoverChange?.(null)}
      className={`card-tactile-lift bg-[var(--bg-surface)] rounded-[16px] border overflow-hidden transition-colors ${
        isHorizontal
          ? 'flex flex-col md:flex-row'
          : 'flex flex-col justify-between'
      } ${
        isHighlighted
          ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20'
          : 'border-[var(--border-stone)]'
      }`}
    >
      {/* Media Frame */}
      <div
        className={`relative overflow-hidden bg-[var(--bg-muted)] shrink-0 ${
          isHorizontal
            ? 'w-full md:w-64 lg:w-72 aspect-[4/3] md:aspect-auto md:min-h-[220px]'
            : 'w-full aspect-[4/3]'
        }`}
      >
        <Image
          src={resolvedImageSrc}
          alt={name}
          fill
          sizes={
            isHorizontal
              ? '(max-width: 768px) 100vw, 288px'
              : '(max-width: 768px) 100vw, 420px'
          }
          className="object-cover card-tactile-image"
          onError={() => setImageFailed(true)}
        />

        {/* Neutral Scrim when SPK drawer opens */}
        {matchingDetails && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181A18]/60 via-transparent to-transparent transition-opacity duration-300 ${
              showBreakdown ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top-Left Badge: SPK Progressive Pill OR AI Similarity OR Rank */}
        {spkPct !== null ? (
          <div
            className="absolute top-3 left-3 z-20"
            onMouseEnter={() => matchingDetails && setBreakdownHovered(true)}
            onMouseLeave={() => matchingDetails && setBreakdownHovered(false)}
          >
            {matchingDetails ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBreakdownPinned((prev) => !prev);
                }}
                aria-expanded={showBreakdown}
                aria-label={`Skor kecocokan SPK ${spkPct} persen untuk ${name}. Buka rincian kriteria.`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
                  highlightTop
                    ? 'bg-[var(--accent-spark)] text-white'
                    : 'bg-[var(--bg-surface)]/95 text-[var(--accent-primary)] border border-[var(--border-stone)]'
                }`}
              >
                {typeof rank === 'number' && (
                  <span className="font-mono-tabular font-bold">#{rank}</span>
                )}
                <span className="font-mono-tabular font-bold">{spkPct}%</span>
                <span>{highlightTop ? 'Paling Cocok' : 'Cocok'}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showBreakdown ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  highlightTop
                    ? 'bg-[var(--accent-spark)] text-white'
                    : 'bg-[var(--bg-surface)]/95 text-[var(--accent-primary)] border border-[var(--border-stone)]'
                }`}
              >
                {typeof rank === 'number' && (
                  <span className="font-mono-tabular font-bold">#{rank}</span>
                )}
                <span className="font-mono-tabular font-bold">{spkPct}%</span>
                <span>Cocok</span>
              </span>
            )}
          </div>
        ) : aiPct !== null ? (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/25">
              <svg
                className="w-3.5 h-3.5"
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
              <span className="font-mono-tabular font-bold">{aiPct}%</span>
              <span>Relevan</span>
            </span>
          </div>
        ) : typeof rank === 'number' ? (
          <div className="absolute top-3 left-3 z-20">
            <span className="font-mono-tabular inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--ink-primary)] text-white">
              #{rank}
            </span>
          </div>
        ) : null}

        {/* Top-Right Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={addFavorite.isPending || removeFavorite.isPending}
          aria-pressed={isLiked}
          aria-label={
            isLiked
              ? `Hapus ${name} dari favorit`
              : `Simpan ${name} ke favorit`
          }
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer disabled:opacity-60 ${
            isLiked
              ? 'bg-[var(--accent-spark-tint)] border-[var(--accent-spark)]/40 text-[var(--accent-spark)]'
              : 'bg-[var(--bg-surface)]/95 border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--accent-spark)]'
          }`}
        >
          <svg
            className={`w-4 h-4 ${heartBurst ? 'heart-spring-burst' : ''}`}
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Sample Fallback Label */}
        {!imageUrl && !hasPhotos && !showBreakdown && (
          <div className="absolute bottom-2.5 left-3 z-10 px-2 py-0.5 rounded-full bg-[#181A18]/75 text-white text-xs font-medium">
            Sample
          </div>
        )}

        {/* Progressive SPK Breakdown Tray */}
        {matchingDetails && (
          <div
            style={{ boxShadow: 'var(--shadow-float)' }}
            className={`spring-transition absolute left-3 right-3 bottom-3 z-10 rounded-[12px] bg-[var(--bg-surface)]/95 border border-[var(--border-stone)] p-3 ${
              showBreakdown
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-primary)] mb-2">
              <span>Rincian SPK</span>
              <span className="font-mono-tabular text-[var(--ink-secondary)]">
                / 100
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {(
                [
                  {
                    label: 'Harga',
                    val: normalizeSpkScore(matchingDetails.priceScore),
                  },
                  {
                    label: 'Lokasi',
                    val: normalizeSpkScore(matchingDetails.locationScore),
                  },
                  {
                    label: 'Fasilitas',
                    val: normalizeSpkScore(matchingDetails.facilitiesScore),
                  },
                  {
                    label: 'Rating',
                    val: normalizeSpkScore(matchingDetails.ratingScore),
                  },
                ] as const
              ).map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--ink-secondary)]">
                      {item.label}
                    </span>
                    <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                      {item.val}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent-primary)] spring-transition"
                      style={{ width: showBreakdown ? `${item.val}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Column */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4 min-w-0">
        <div className="space-y-2.5">
          {/* District + Availability Metadata */}
          <div className="flex items-center justify-between gap-2 text-xs text-[var(--ink-secondary)]">
            <span className="truncate font-medium">{city || 'Semarang'}</span>
            {typeof availableRooms === 'number' && (
              <span className="font-mono-tabular font-semibold text-[var(--accent-primary)] shrink-0">
                {availableRooms} kamar tersedia
              </span>
            )}
          </div>

          {/* Title & Address */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-[-0.015em] text-[var(--ink-primary)] leading-snug line-clamp-2">
              <Link
                href={`/kos/${id}/view`}
                onClick={() => trackView.mutate(id)}
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                {name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-[var(--ink-secondary)] truncate">
              {address}
              {city && !address.toLowerCase().includes(city.toLowerCase())
                ? `, ${city}`
                : ''}
            </p>
            {description && description !== name && (
              <p className="mt-1.5 text-xs text-[var(--ink-secondary)] line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Distance + Rating Row */}
          {(typeof distance === 'number' || (typeof rating === 'number' && rating > 0)) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ink-secondary)]">
              {typeof rating === 'number' && rating > 0 && (
                <span className="inline-flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-[var(--accent-spark)]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                    {rating.toFixed(1)}
                  </span>
                  <span>({reviewCount})</span>
                </span>
              )}
              {typeof distance === 'number' && (
                <>
                  {typeof rating === 'number' && rating > 0 && (
                    <span aria-hidden="true">·</span>
                  )}
                  <span className="font-mono-tabular font-medium text-[var(--ink-primary)]">
                    {distance.toFixed(1)} km
                  </span>
                </>
              )}
            </div>
          )}

          {/* Facilities Pills */}
          {cleanFacilities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {cleanFacilities.slice(0, 3).map((facility, idx) => (
                <span
                  key={`${facility}-${idx}`}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-muted)] text-[var(--ink-secondary)]"
                >
                  {facility}
                </span>
              ))}
              {cleanFacilities.length > 3 && (
                <span className="font-mono-tabular text-xs text-[var(--ink-secondary)] px-1">
                  +{cleanFacilities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Price & Actions */}
        <div className="pt-3.5 border-t border-[var(--border-stone)] flex items-center justify-between gap-2 flex-wrap">
          <div>
            <span className="font-mono-tabular text-base font-bold text-[var(--ink-primary)]">
              {formatRupiah(numericPrice)}
            </span>
            <span className="text-xs text-[var(--ink-secondary)]"> /bulan</span>
          </div>

          <div className="flex items-center gap-2">
            {showCompareButton && (
              <button
                type="button"
                onClick={handleCompareClick}
                disabled={compareDisabled}
                aria-pressed={compared}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                  compared
                    ? 'bg-[var(--accent-tint)] border-[var(--accent-primary)] text-[var(--accent-primary)]'
                    : 'bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                }`}
              >
                {compared ? 'Dibandingkan' : '+ Bandingkan'}
              </button>
            )}
            <Link
              href={`/kos/${id}/view`}
              onClick={(e) => {
                e.stopPropagation();
                trackView.mutate(id);
              }}
              className="px-3.5 py-1.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default UnifiedKosCard;
