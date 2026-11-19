'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/contexts/CompareContext';

const EXCLUDED_PREFIXES = ['/design-playground', '/admin', '/seller', '/auth'];
const FALLBACK_ROOM_IMAGE = '/images/rooms/room1.jpg';

function normalizeScoreToPercent(score: number): number {
  const pct = score <= 5 ? (score / 5) * 100 : score;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function GlobalCompareDock() {
  const pathname = usePathname();
  const { comparedItems, removeCompare, clearCompare, maxItems } = useCompare();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (comparedItems.length < 2 && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [comparedItems.length, isModalOpen]);

  const isExcludedRoute = EXCLUDED_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  if (isExcludedRoute || comparedItems.length === 0) {
    return null;
  }

  const lowestPrice = Math.min(...comparedItems.map((item) => item.price));
  const scoresWithValues = comparedItems
    .map((item) =>
      typeof item.matchingScore === 'number'
        ? normalizeScoreToPercent(item.matchingScore)
        : null
    )
    .filter((val): val is number => val !== null);
  const highestMatch =
    scoresWithValues.length > 0 ? Math.max(...scoresWithValues) : null;
  const hasAnySpkDetails = comparedItems.some(
    (item) => item.matchingDetails !== undefined
  );
  const allFacilities = Array.from(
    new Set(comparedItems.flatMap((item) => item.facilities))
  ).slice(0, 7);

  const getThumbnailSrc = (id: number, imageUrl?: string) => {
    if (failedImages[id] || !imageUrl) return FALLBACK_ROOM_IMAGE;
    return imageUrl;
  };

  return (
    <>
      <div
        role="region"
        aria-label="Room comparison dock"
        style={{ boxShadow: 'var(--shadow-float)' }}
        className="dock-spring-enter fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[18px] px-4 py-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Selected Thumbnails + Empty Slots */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {comparedItems.map((kos) => {
              const matchPct =
                typeof kos.matchingScore === 'number'
                  ? normalizeScoreToPercent(kos.matchingScore)
                  : null;

              return (
                <div
                  key={kos.id}
                  className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-[10px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] shrink-0"
                >
                  <div className="relative w-8 h-8 rounded-[6px] overflow-hidden shrink-0 bg-[var(--bg-muted)]">
                    <Image
                      src={getThumbnailSrc(kos.id, kos.imageUrl)}
                      alt={kos.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [kos.id]: true }))
                      }
                    />
                  </div>
                  <div className="max-w-[118px]">
                    <div className="text-xs font-semibold text-[var(--ink-primary)] truncate">
                      {kos.name}
                    </div>
                    <div className="font-mono-tabular text-[11px] text-[var(--accent-primary)] font-semibold">
                      {matchPct !== null
                        ? `${matchPct}% match`
                        : formatRupiah(kos.price)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCompare(kos.id)}
                    aria-label={`Remove ${kos.name} from comparison`}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--ink-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
                  >
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}

            {Array.from({
              length: Math.max(0, maxItems - comparedItems.length),
            }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                className="hidden md:flex items-center justify-center h-10 px-3 rounded-[10px] border border-dashed border-[var(--border-stone)] text-xs text-[var(--ink-secondary)] shrink-0"
              >
                + Add slot
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
            <span
              key={comparedItems.length}
              className="counter-spring-pop font-mono-tabular text-xs font-semibold text-[var(--ink-secondary)]"
            >
              {comparedItems.length} / {maxItems} selected
            </span>
            <button
              type="button"
              onClick={clearCompare}
              className="px-2.5 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={comparedItems.length < 2}
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Room Comparison Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-compare-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181A18]/45 backdrop-blur-[2px]"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-5 sm:p-7 space-y-6"
            style={{ boxShadow: 'var(--shadow-float)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-stone)]">
              <div>
                <h2
                  id="global-compare-modal-title"
                  className="text-xl sm:text-2xl font-bold text-[var(--ink-primary)] tracking-[-0.02em]"
                >
                  Side-by-Side Room Comparison
                </h2>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-1">
                  Compare monthly rent, location, SPK fit, and included facilities across your shortlisted rooms.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close comparison dialog"
                className="w-9 h-9 rounded-[10px] border border-[var(--border-stone)] flex items-center justify-center text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-canvas)] cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <div
                className="grid gap-4 min-w-[540px]"
                style={{
                  gridTemplateColumns: `repeat(${comparedItems.length}, minmax(0, 1fr))`,
                }}
              >
                {comparedItems.map((kos) => {
                  const isLowestRent = kos.price === lowestPrice;
                  const matchPct =
                    typeof kos.matchingScore === 'number'
                      ? normalizeScoreToPercent(kos.matchingScore)
                      : null;
                  const isBestMatch =
                    highestMatch !== null && matchPct === highestMatch;

                  return (
                    <div
                      key={kos.id}
                      className="rounded-[16px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] p-4 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Thumbnail & Title */}
                        <div>
                          <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden mb-3 bg-[var(--bg-muted)]">
                            <Image
                              src={getThumbnailSrc(kos.id, kos.imageUrl)}
                              alt={kos.name}
                              fill
                              sizes="280px"
                              className="object-cover"
                              onError={() =>
                                setFailedImages((prev) => ({
                                  ...prev,
                                  [kos.id]: true,
                                }))
                              }
                            />
                          </div>
                          <h3 className="text-base font-bold text-[var(--ink-primary)]">
                            {kos.name}
                          </h3>
                          <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                            {kos.city || kos.address}
                            {typeof kos.availableRooms === 'number' &&
                              ` · ${kos.availableRooms} rooms available`}
                          </p>
                        </div>

                        {/* Monthly Rent */}
                        <div className="p-3 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-[var(--ink-secondary)]">
                              Monthly Rent
                            </span>
                            {isLowestRent && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                                Lowest Rent
                              </span>
                            )}
                          </div>
                          <div className="font-mono-tabular text-lg font-bold text-[var(--ink-primary)] mt-1">
                            {formatRupiah(kos.price)}
                          </div>
                        </div>

                        {/* SPK Score Breakdown (if available) */}
                        {hasAnySpkDetails && kos.matchingDetails && (
                          <div className="p-3 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)] space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[var(--ink-primary)]">
                                SPK Match
                              </span>
                              {matchPct !== null && (
                                <span
                                  className={`font-mono-tabular text-sm font-bold ${
                                    isBestMatch
                                      ? 'text-[var(--accent-spark)]'
                                      : 'text-[var(--accent-primary)]'
                                  }`}
                                >
                                  {matchPct}%
                                </span>
                              )}
                            </div>
                            {(
                              [
                                {
                                  label: 'Price',
                                  val: normalizeScoreToPercent(
                                    kos.matchingDetails.priceScore
                                  ),
                                },
                                {
                                  label: 'Location',
                                  val: normalizeScoreToPercent(
                                    kos.matchingDetails.locationScore
                                  ),
                                },
                                {
                                  label: 'Facilities',
                                  val: normalizeScoreToPercent(
                                    kos.matchingDetails.facilitiesScore
                                  ),
                                },
                                {
                                  label: 'Rating',
                                  val: normalizeScoreToPercent(
                                    kos.matchingDetails.ratingScore
                                  ),
                                },
                              ] as const
                            ).map((metric) => (
                              <div key={metric.label} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[var(--ink-secondary)]">
                                    {metric.label}
                                  </span>
                                  <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                                    {metric.val}
                                  </span>
                                </div>
                                <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[var(--accent-primary)]"
                                    style={{ width: `${metric.val}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Rating & Distance */}
                        <div className="text-xs space-y-1.5 text-[var(--ink-secondary)]">
                          <div className="flex justify-between">
                            <span>Rating</span>
                            <span className="font-mono-tabular font-medium text-[var(--ink-primary)]">
                              {typeof kos.averageRating === 'number' &&
                              kos.averageRating > 0
                                ? `${kos.averageRating.toFixed(1)} (${kos.reviewCount ?? 0})`
                                : 'No reviews yet'}
                            </span>
                          </div>
                          {typeof kos.distance === 'number' && (
                            <div className="flex justify-between">
                              <span>Distance</span>
                              <span className="font-mono-tabular font-medium text-[var(--ink-primary)]">
                                {kos.distance.toFixed(1)} km
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Facilities Checklist */}
                        {allFacilities.length > 0 && (
                          <div className="pt-3 border-t border-[var(--border-stone)] space-y-1.5">
                            <div className="text-xs font-semibold text-[var(--ink-primary)] mb-2">
                              Facilities Check
                            </div>
                            {allFacilities.map((facility) => {
                              const hasFacility =
                                kos.facilities.includes(facility);
                              return (
                                <div
                                  key={facility}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  {hasFacility ? (
                                    <svg
                                      className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={1.75}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-3.5 h-3.5 text-[var(--ink-secondary)]/45 shrink-0"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={1.75}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                  )}
                                  <span
                                    className={
                                      hasFacility
                                        ? 'text-[var(--ink-primary)]'
                                        : 'text-[var(--ink-secondary)]/65'
                                    }
                                  >
                                    {facility}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/kos/${kos.id}/view`}
                        onClick={() => setIsModalOpen(false)}
                        className="block w-full text-center py-2.5 px-3 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
                      >
                        View Detail
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
