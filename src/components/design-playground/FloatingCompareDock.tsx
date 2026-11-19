"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatRupiah, type PlaygroundKos } from "./playgroundData";

export interface CompareKosItem extends PlaygroundKos {
  matchScore: number;
}

interface FloatingCompareDockProps {
  selectedKosList: CompareKosItem[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function FloatingCompareDock({
  selectedKosList,
  onRemove,
  onClear,
}: FloatingCompareDockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedKosList.length < 2 && isModalOpen) {
      setIsModalOpen(false);
    }
  }, [selectedKosList.length, isModalOpen]);

  if (selectedKosList.length === 0) {
    return null;
  }

  const lowestPrice = Math.min(...selectedKosList.map((k) => k.monthlyPrice));
  const highestMatch = Math.max(...selectedKosList.map((k) => k.matchScore));
  const allFacilities = Array.from(
    new Set(selectedKosList.flatMap((k) => k.facilities))
  ).slice(0, 7);

  return (
    <>
      {/* Floating Spring-Loaded Dock */}
      <div
        role="region"
        aria-label="Room comparison dock"
        style={{ boxShadow: "var(--shadow-float)" }}
        className="pg-dock-enter fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[18px] px-4 py-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Selected Thumbnails + Empty Slots */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {selectedKosList.map((kos) => (
              <div
                key={kos.id}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-[10px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] shrink-0"
              >
                <div className="relative w-8 h-8 rounded-[6px] overflow-hidden shrink-0">
                  <Image
                    src={kos.image}
                    alt={kos.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="max-w-[110px]">
                  <div className="text-xs font-semibold text-[var(--ink-primary)] truncate">
                    {kos.name}
                  </div>
                  <div className="pg-mono text-[10px] text-[var(--accent-primary)] font-semibold">
                    {kos.matchScore}% match
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(kos.id)}
                  aria-label={`Remove ${kos.name} from comparison`}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--ink-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 3 - selectedKosList.length) }).map(
              (_, idx) => (
                <div
                  key={`empty-slot-${idx}`}
                  className="hidden md:flex items-center justify-center h-10 px-3 rounded-[10px] border border-dashed border-[var(--border-stone)] text-[11px] text-[var(--ink-secondary)] shrink-0"
                >
                  + Add slot
                </div>
              )
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
            <span
              key={selectedKosList.length}
              className="pg-counter-pop pg-mono text-xs font-semibold text-[var(--ink-secondary)]"
            >
              {selectedKosList.length} / 3 selected
            </span>
            <button
              type="button"
              onClick={onClear}
              className="px-2.5 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={selectedKosList.length < 2}
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181A18]/45 backdrop-blur-[2px]"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-5 sm:p-7 space-y-6"
            style={{ boxShadow: "var(--shadow-float)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-stone)]">
              <div>
                <h2
                  id="compare-modal-title"
                  className="text-xl sm:text-2xl font-bold text-[var(--ink-primary)] tracking-[-0.02em]"
                >
                  Side-by-Side Room Comparison
                </h2>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-1">
                  Aligned SPK criteria, rent, campus distance, and included
                  facilities.
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
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Comparison Columns */}
            <div className="overflow-x-auto">
              <div
                className="grid gap-4 min-w-[540px]"
                style={{
                  gridTemplateColumns: `repeat(${selectedKosList.length}, minmax(0, 1fr))`,
                }}
              >
                {selectedKosList.map((kos) => {
                  const isLowestRent = kos.monthlyPrice === lowestPrice;
                  const isBestMatch = kos.matchScore === highestMatch;

                  return (
                    <div
                      key={kos.id}
                      className="rounded-[16px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] p-4 space-y-4"
                    >
                      {/* Thumbnail & Name */}
                      <div>
                        <div className="relative aspect-[4/3] w-full rounded-[12px] overflow-hidden mb-3">
                          <Image
                            src={kos.image}
                            alt={kos.name}
                            fill
                            sizes="280px"
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-base font-bold text-[var(--ink-primary)]">
                          {kos.name}
                        </h3>
                        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                          {kos.district} · {kos.availableRooms} rooms left
                        </p>
                      </div>

                      {/* Rent Highlight */}
                      <div className="p-3 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-[var(--ink-secondary)]">
                            Monthly Rent
                          </span>
                          {isLowestRent && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                              Lowest Rent
                            </span>
                          )}
                        </div>
                        <div className="pg-mono text-lg font-bold text-[var(--ink-primary)] mt-1">
                          {formatRupiah(kos.monthlyPrice)}
                        </div>
                      </div>

                      {/* SPK Score + 4 Bars */}
                      <div className="p-3 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--ink-primary)]">
                            SPK Match
                          </span>
                          <span
                            className={`pg-mono text-sm font-bold ${
                              isBestMatch
                                ? "text-[var(--accent-spark)]"
                                : "text-[var(--accent-primary)]"
                            }`}
                          >
                            {kos.matchScore}%
                          </span>
                        </div>
                        {(
                          [
                            { label: "Price", val: kos.subScores.price },
                            { label: "Location", val: kos.subScores.location },
                            {
                              label: "Facilities",
                              val: kos.subScores.facilities,
                            },
                            { label: "Rating", val: kos.subScores.rating },
                          ] as const
                        ).map((metric) => (
                          <div key={metric.label} className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[var(--ink-secondary)]">
                                {metric.label}
                              </span>
                              <span className="pg-mono font-semibold text-[var(--ink-primary)]">
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

                      {/* Specs */}
                      <div className="text-xs space-y-1.5 text-[var(--ink-secondary)]">
                        <div className="flex justify-between">
                          <span>Distance</span>
                          <span className="pg-mono font-medium text-[var(--ink-primary)]">
                            {kos.distanceKm.toFixed(1)} km to {kos.landmark}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Room Size</span>
                          <span className="pg-mono font-medium text-[var(--ink-primary)]">
                            {kos.roomSize}
                          </span>
                        </div>
                      </div>

                      {/* Facilities Checklist */}
                      <div className="pt-3 border-t border-[var(--border-stone)] space-y-1.5">
                        <div className="text-xs font-semibold text-[var(--ink-primary)] mb-2">
                          Facilities Check
                        </div>
                        {allFacilities.map((facility) => {
                          const hasFacility = kos.facilities.includes(facility);
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
                                  strokeWidth={2.2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <svg
                                  className="w-3.5 h-3.5 text-[var(--ink-secondary)]/40 shrink-0"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
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
                                    ? "text-[var(--ink-primary)]"
                                    : "text-[var(--ink-secondary)]/60"
                                }
                              >
                                {facility}
                              </span>
                            </div>
                          );
                        })}
                      </div>
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
