"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  formatRupiah,
  type PlaygroundKos,
  type SpkWeights,
} from "./playgroundData";

interface StickyDetailPreviewProps {
  kos: PlaygroundKos;
  matchScore: number;
  weights: SpkWeights;
  isFavorited: boolean;
  isCompared: boolean;
  compareDisabled: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
}

const DURATION_OPTIONS = [
  { months: 1, label: "1 mo", discount: 0 },
  { months: 3, label: "3 mo", discount: 0 },
  { months: 6, label: "6 mo", discount: 0.05 },
] as const;

export default function StickyDetailPreview({
  kos,
  matchScore,
  weights,
  isFavorited,
  isCompared,
  compareDisabled,
  onToggleFavorite,
  onToggleCompare,
}: StickyDetailPreviewProps) {
  const [selectedMonths, setSelectedMonths] = useState<1 | 3 | 6>(1);
  const [bookingRequested, setBookingRequested] = useState(false);

  useEffect(() => {
    setBookingRequested(false);
  }, [kos.id]);

  const activeDuration =
    DURATION_OPTIONS.find((d) => d.months === selectedMonths) ||
    DURATION_OPTIONS[0];
  const rawTotal = kos.monthlyPrice * activeDuration.months;
  const finalTotal = Math.round(rawTotal * (1 - activeDuration.discount));

  const totalWeight =
    weights.price + weights.location + weights.facilities + weights.rating || 1;

  return (
    <section
      id="detail-preview"
      aria-labelledby="detail-preview-heading"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            id="detail-preview-heading"
            className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[var(--ink-primary)]"
          >
            3. Detail Page Editorial Split & Sticky Match Panel
          </h2>
          <p className="mt-2 text-base text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
            Previewing{" "}
            <span className="font-semibold text-[var(--ink-primary)]">
              {kos.name}
            </span>
            . Click &ldquo;Preview Detail&rdquo; on any card above to swap the
            gallery and recalculate the personal SPK fit panel.
          </p>
        </div>
        <span className="pg-mono text-xs text-[var(--ink-secondary)] bg-[var(--bg-muted)] px-3 py-1.5 rounded-full self-start md:self-auto">
          /kos/[id]/view prototype
        </span>
      </div>

      {/* Outer Stage Frame */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Asymmetric Editorial Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[var(--bg-muted)]">
            <Image
              src={kos.gallery[0]}
              alt={`${kos.name} main interior`}
              fill
              sizes="(max-width: 1024px) 100vw, 680px"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3">
            <div className="relative aspect-[4/3] lg:aspect-auto rounded-[16px] overflow-hidden bg-[var(--bg-muted)]">
              <Image
                src={kos.gallery[1]}
                alt={`${kos.name} study corner`}
                fill
                sizes="(max-width: 1024px) 50vw, 440px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto rounded-[16px] overflow-hidden bg-[var(--bg-muted)]">
              <Image
                src={kos.gallery[2]}
                alt={`${kos.name} courtyard lounge`}
                fill
                sizes="(max-width: 1024px) 50vw, 440px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Narrative & Facts Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3 pb-6 border-b border-[var(--border-stone)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-muted)] text-[var(--ink-primary)]">
                  {kos.genderPolicy}
                </span>
                <span className="pg-mono px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                  {kos.availableRooms} of {kos.totalRooms} rooms open
                </span>
                <span className="pg-mono px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-[var(--ink-secondary)]">
                  {kos.roomSize}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
                {kos.name}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--ink-secondary)]">
                <span>{kos.address}</span>
                <span aria-hidden="true">·</span>
                <span className="pg-mono font-medium text-[var(--ink-primary)]">
                  {kos.distanceKm.toFixed(1)} km to {kos.landmark}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-[var(--ink-primary)] mb-2">
                Living Atmosphere
              </h4>
              <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-[1.62] max-w-[65ch]">
                {kos.description}
              </p>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="text-base font-bold text-[var(--ink-primary)] mb-3">
                Room & Building Facilities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {kos.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-xs font-medium text-[var(--ink-primary)]"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent All-In Utilities */}
            <div className="rounded-[16px] bg-[var(--bg-muted)]/70 border border-[var(--border-stone)] p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="text-sm font-bold text-[var(--ink-primary)]">
                  Included in Monthly Rent
                </h4>
                <span className="text-xs text-[var(--ink-secondary)]">
                  No hidden admin fees
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {kos.includedUtilities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-[var(--ink-primary)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Decision & Personal SPK Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="rounded-[16px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] p-5 sm:p-6 space-y-5">
              {/* Price Header */}
              <div className="flex items-baseline justify-between gap-2 pb-4 border-b border-[var(--border-stone)]">
                <div>
                  <div className="pg-mono text-2xl font-bold text-[var(--ink-primary)]">
                    {formatRupiah(kos.monthlyPrice)}
                  </div>
                  <div className="text-xs text-[var(--ink-secondary)]">
                    per month · electricity metered separately
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <svg
                    className="w-4 h-4 text-[var(--accent-spark)]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="pg-mono">{kos.rating.toFixed(1)}</span>
                  <span className="text-[var(--ink-secondary)]">
                    ({kos.reviewCount})
                  </span>
                </div>
              </div>

              {/* Interactive Rental Duration Switcher */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--ink-primary)]">
                    Stay Duration Estimate
                  </span>
                  {activeDuration.discount > 0 && (
                    <span className="text-[11px] font-semibold text-[var(--accent-primary)]">
                      Sample 5% 6-mo prepay
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map((option) => {
                    const isSelected = selectedMonths === option.months;
                    return (
                      <button
                        key={option.months}
                        type="button"
                        onClick={() => setSelectedMonths(option.months)}
                        className={`pg-mono py-2 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[var(--ink-primary)] border-[var(--ink-primary)] text-white"
                            : "bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-stone)] text-xs">
                  <span className="text-[var(--ink-secondary)]">
                    Estimated Total ({activeDuration.months} mo)
                  </span>
                  <span className="pg-mono font-bold text-sm text-[var(--ink-primary)]">
                    {formatRupiah(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Personal SPK Fit Breakdown */}
              <div className="rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[var(--ink-primary)]">
                    Personal SPK Match Fit
                  </span>
                  <span className="pg-mono px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                    {matchScore}% Fit
                  </span>
                </div>
                <div className="space-y-2">
                  {(
                    [
                      {
                        label: "Price",
                        score: kos.subScores.price,
                        weight: Math.round((weights.price / totalWeight) * 100),
                      },
                      {
                        label: "Location",
                        score: kos.subScores.location,
                        weight: Math.round(
                          (weights.location / totalWeight) * 100
                        ),
                      },
                      {
                        label: "Facilities",
                        score: kos.subScores.facilities,
                        weight: Math.round(
                          (weights.facilities / totalWeight) * 100
                        ),
                      },
                      {
                        label: "Rating",
                        score: kos.subScores.rating,
                        weight: Math.round(
                          (weights.rating / totalWeight) * 100
                        ),
                      },
                    ] as const
                  ).map((row) => (
                    <div key={row.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--ink-secondary)]">
                          {row.label}{" "}
                          <span className="pg-mono opacity-75">
                            ({row.weight}% wt)
                          </span>
                        </span>
                        <span className="pg-mono font-semibold text-[var(--ink-primary)]">
                          {row.score}/100
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--accent-primary)] pg-spring-transition"
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary CTA + Secondary Actions */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setBookingRequested((prev) => !prev)}
                  className="w-full py-3 px-4 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                  {bookingRequested
                    ? "Viewing Request Staged"
                    : "Book Viewing / Reserve"}
                </button>

                {bookingRequested && (
                  <div
                    role="status"
                    className="p-3 rounded-[10px] bg-[var(--accent-tint)] border border-[var(--accent-primary)]/30 text-xs text-[var(--accent-primary)] leading-relaxed"
                  >
                    Preview confirmation: viewing request staged for{" "}
                    <span className="font-semibold">{kos.name}</span> (
                    {activeDuration.months} mo plan). In production this routes
                    directly to the owner booking flow.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(kos.id)}
                    aria-pressed={isFavorited}
                    className={`py-2.5 px-3 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
                      isFavorited
                        ? "bg-[var(--accent-spark-tint)] border-[var(--accent-spark)]/40 text-[var(--accent-spark)]"
                        : "bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]"
                    }`}
                  >
                    {isFavorited ? "Saved to Favorites" : "Save Room"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleCompare(kos.id)}
                    disabled={!isCompared && compareDisabled}
                    aria-pressed={isCompared}
                    className={`py-2.5 px-3 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                      isCompared
                        ? "bg-[var(--accent-tint)] border-[var(--accent-primary)] text-[var(--accent-primary)]"
                        : "bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]"
                    }`}
                  >
                    {isCompared ? "In Compare Dock" : "+ Compare"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
