"use client";

import { useState } from "react";
import Image from "next/image";
import { formatRupiah, type PlaygroundKos } from "./playgroundData";

interface PlaygroundKosCardProps {
  kos: PlaygroundKos;
  matchScore: number;
  isTopMatch: boolean;
  isFavorited: boolean;
  isCompared: boolean;
  compareDisabled: boolean;
  isMapHighlighted: boolean;
  isPreviewActive: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onSelectPreview: (id: number) => void;
  onHoverChange: (id: number | null) => void;
}

export default function PlaygroundKosCard({
  kos,
  matchScore,
  isTopMatch,
  isFavorited,
  isCompared,
  compareDisabled,
  isMapHighlighted,
  isPreviewActive,
  onToggleFavorite,
  onToggleCompare,
  onSelectPreview,
  onHoverChange,
}: PlaygroundKosCardProps) {
  const [breakdownPinned, setBreakdownPinned] = useState(false);
  const [breakdownHovered, setBreakdownHovered] = useState(false);
  const [heartAnimated, setHeartAnimated] = useState(false);

  const showBreakdown = breakdownPinned || breakdownHovered;

  const handleHeartClick = () => {
    setHeartAnimated(true);
    onToggleFavorite(kos.id);
    window.setTimeout(() => setHeartAnimated(false), 480);
  };

  return (
    <article
      onMouseEnter={() => onHoverChange(kos.id)}
      onMouseLeave={() => onHoverChange(null)}
      className={`pg-card-lift bg-[var(--bg-surface)] rounded-[16px] border overflow-hidden flex flex-col justify-between transition-colors ${
        isMapHighlighted || isPreviewActive
          ? "border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/20"
          : "border-[var(--border-stone)]"
      }`}
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--bg-muted)]">
        <Image
          src={kos.image}
          alt={kos.name}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover pg-card-image"
        />

        {/* Subtle bottom scrim for visual legibility when breakdown expands */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181A18]/55 via-transparent to-transparent transition-opacity duration-300 ${
            showBreakdown ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Top-Left Progressive SPK Match Pill */}
        <div
          className="absolute top-3 left-3 z-20"
          onMouseEnter={() => setBreakdownHovered(true)}
          onMouseLeave={() => setBreakdownHovered(false)}
        >
          <button
            type="button"
            onClick={() => setBreakdownPinned((prev) => !prev)}
            aria-expanded={showBreakdown}
            aria-label={`SPK match score ${matchScore} percent for ${kos.name}. Toggle criteria breakdown.`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
              isTopMatch
                ? "bg-[var(--accent-spark)] text-white"
                : "bg-[var(--bg-surface)]/95 text-[var(--accent-primary)] border border-[var(--border-stone)]"
            }`}
          >
            <span className="pg-mono font-bold">{matchScore}%</span>
            <span>{isTopMatch ? "Top Match" : "Match"}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showBreakdown ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Top-Right Tactile Favorite Heart */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-pressed={isFavorited}
          aria-label={
            isFavorited
              ? `Remove ${kos.name} from saved rooms`
              : `Save ${kos.name} to favorites`
          }
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
            isFavorited
              ? "bg-[var(--accent-spark-tint)] border-[var(--accent-spark)]/40 text-[var(--accent-spark)]"
              : "bg-[var(--bg-surface)]/95 border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--accent-spark)]"
          }`}
        >
          <svg
            className={`w-4 h-4 ${heartAnimated ? "pg-heart-active" : ""}`}
            viewBox="0 0 24 24"
            fill={isFavorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Progressive Disclosure SPK Breakdown Drawer inside Media Frame */}
        <div
          className={`pg-spring-transition absolute left-3 right-3 bottom-3 z-10 rounded-[12px] bg-[var(--bg-surface)]/96 border border-[var(--border-stone)] p-3 shadow-lg ${
            showBreakdown
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-primary)] mb-2">
            <span>SPK Criteria Fit</span>
            <span className="pg-mono text-[var(--ink-secondary)]">
              out of 100
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {(
              [
                { label: "Price", value: kos.subScores.price },
                { label: "Location", value: kos.subScores.location },
                { label: "Facilities", value: kos.subScores.facilities },
                { label: "Rating", value: kos.subScores.rating },
              ] as const
            ).map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--ink-secondary)]">
                    {item.label}
                  </span>
                  <span className="pg-mono font-semibold text-[var(--ink-primary)]">
                    {item.value}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent-primary)] pg-spring-transition"
                    style={{ width: showBreakdown ? `${item.value}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Calm Metadata Line */}
          <div className="flex items-center justify-between gap-2 text-xs text-[var(--ink-secondary)]">
            <span>
              {kos.district} · {kos.genderPolicy}
            </span>
            <span className="pg-mono font-medium text-[var(--accent-primary)]">
              {kos.availableRooms} {kos.availableRooms === 1 ? "room" : "rooms"} left
            </span>
          </div>

          {/* Title & Location */}
          <div>
            <h3 className="text-lg font-bold tracking-[-0.015em] text-[var(--ink-primary)] leading-snug">
              {kos.name}
            </h3>
            <p className="mt-1 text-xs text-[var(--ink-secondary)] flex items-center gap-1.5">
              <span className="truncate">{kos.address}</span>
            </p>
          </div>

          {/* Distance + Rating Row */}
          <div className="flex items-center gap-3 text-xs text-[var(--ink-secondary)]">
            <span className="pg-mono font-medium text-[var(--ink-primary)]">
              {kos.distanceKm.toFixed(1)} km to {kos.landmark}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-[var(--accent-spark)]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="pg-mono font-semibold text-[var(--ink-primary)]">
                {kos.rating.toFixed(1)}
              </span>
              <span>({kos.reviewCount})</span>
            </span>
          </div>

          {/* Max 3 Facility Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {kos.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--bg-muted)] text-[var(--ink-secondary)]"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3.5 border-t border-[var(--border-stone)] flex items-center justify-between gap-2 flex-wrap">
          <div>
            <span className="pg-mono text-base font-bold text-[var(--ink-primary)]">
              {formatRupiah(kos.monthlyPrice)}
            </span>
            <span className="text-xs text-[var(--ink-secondary)]"> /mo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleCompare(kos.id)}
              disabled={!isCompared && compareDisabled}
              aria-pressed={isCompared}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                isCompared
                  ? "bg-[var(--accent-tint)] border-[var(--accent-primary)] text-[var(--accent-primary)]"
                  : "bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]"
              }`}
            >
              {isCompared ? "Comparing" : "+ Compare"}
            </button>
            <button
              type="button"
              onClick={() => onSelectPreview(kos.id)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer ${
                isPreviewActive
                  ? "bg-[var(--ink-primary)] text-white"
                  : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]"
              }`}
            >
              {isPreviewActive ? "Previewing" : "Preview Detail"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
