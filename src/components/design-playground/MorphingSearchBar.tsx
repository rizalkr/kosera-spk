"use client";

import { useState } from "react";
import {
  DEFAULT_SPK_WEIGHTS,
  VIBE_PRESETS,
  type SpkWeights,
  type VibePreset,
} from "./playgroundData";

interface MorphingSearchBarProps {
  mode: "filter" | "ai";
  onModeChange: (mode: "filter" | "ai") => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  maxBudget: number | null;
  onMaxBudgetChange: (budget: number | null) => void;
  activeVibeId: string | null;
  onSelectVibe: (preset: VibePreset | null) => void;
  weights: SpkWeights;
  onWeightsChange: (weights: SpkWeights) => void;
  onResetAll: () => void;
  resultCount: number;
}

const DISTRICTS = ["All Districts", "Tlogosari", "Tembalang", "Pleburan", "Pedurungan"];

const BUDGET_PRESETS = [
  { label: "Any Budget", value: null },
  { label: "<= Rp 1.2M", value: 1200000 },
  { label: "<= Rp 1.5M", value: 1500000 },
  { label: "<= Rp 2.0M", value: 2000000 },
];

export default function MorphingSearchBar({
  mode,
  onModeChange,
  searchQuery,
  onSearchQueryChange,
  selectedDistrict,
  onDistrictChange,
  maxBudget,
  onMaxBudgetChange,
  activeVibeId,
  onSelectVibe,
  weights,
  onWeightsChange,
  onResetAll,
  resultCount,
}: MorphingSearchBarProps) {
  const [isTunerOpen, setIsTunerOpen] = useState(true);

  const totalWeight =
    weights.price + weights.location + weights.facilities + weights.rating || 1;

  const normalizedPct = {
    price: Math.round((weights.price / totalWeight) * 100),
    location: Math.round((weights.location / totalWeight) * 100),
    facilities: Math.round((weights.facilities / totalWeight) * 100),
    rating: Math.round((weights.rating / totalWeight) * 100),
  };

  const handleSliderChange = (key: keyof SpkWeights, value: number) => {
    onWeightsChange({
      ...weights,
      [key]: value,
    });
  };

  const isDefaultWeights =
    weights.price === DEFAULT_SPK_WEIGHTS.price &&
    weights.location === DEFAULT_SPK_WEIGHTS.location &&
    weights.facilities === DEFAULT_SPK_WEIGHTS.facilities &&
    weights.rating === DEFAULT_SPK_WEIGHTS.rating;

  return (
    <div
      className={`pg-spring-transition rounded-[20px] border bg-[var(--bg-surface)] overflow-hidden ${
        mode === "ai"
          ? "border-[var(--accent-primary)] shadow-[0_14px_34px_-18px_rgba(30,107,82,0.28)]"
          : "border-[var(--border-stone)]"
      }`}
    >
      {/* Top Mode Bar */}
      <div
        className={`pg-spring-transition px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          mode === "ai"
            ? "bg-[var(--accent-tint)] border-[var(--accent-primary)]/20"
            : "bg-[var(--bg-muted)]/60 border-[var(--border-stone)]"
        }`}
      >
        {/* Segmented Control */}
        <div
          role="tablist"
          aria-label="Search Mode"
          className="relative inline-grid grid-cols-2 p-1 rounded-[12px] bg-[var(--bg-surface)] border border-[var(--border-stone)]"
        >
          <span
            aria-hidden="true"
            className={`pg-spring-transition absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-[8px] ${
              mode === "ai"
                ? "translate-x-full bg-[var(--accent-primary)]"
                : "translate-x-0 bg-[var(--ink-primary)]"
            }`}
          />
          <button
            type="button"
            role="tab"
            aria-selected={mode === "filter"}
            onClick={() => onModeChange("filter")}
            className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-[8px] transition-colors cursor-pointer ${
              mode === "filter"
                ? "text-white"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            Standard Filter
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "ai"}
            onClick={() => onModeChange("ai")}
            className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-[8px] transition-colors cursor-pointer ${
              mode === "ai"
                ? "text-white"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            Natural AI Search
          </button>
        </div>

        {/* Tuner & Result Meta */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="pg-mono text-xs text-[var(--ink-secondary)]">
            {resultCount} {resultCount === 1 ? "room" : "rooms"} ranked
          </span>
          <button
            type="button"
            onClick={() => setIsTunerOpen((prev) => !prev)}
            aria-expanded={isTunerOpen}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer ${
              isTunerOpen
                ? "bg-[var(--bg-surface)] border-[var(--accent-primary)] text-[var(--accent-primary)]"
                : "bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]"
            }`}
          >
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
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="2" y1="14" x2="6" y2="14" />
              <line x1="10" y1="8" x2="14" y2="8" />
              <line x1="18" y1="16" x2="22" y2="16" />
            </svg>
            <span>Tune SPK Weights</span>
          </button>
        </div>
      </div>

      {/* Main Input & Morphed Controls */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Unified Search Input */}
          <div className="relative flex-1">
            <label htmlFor="playground-search-input" className="sr-only">
              {mode === "ai"
                ? "Describe your ideal boarding room"
                : "Search boarding house name or street"}
            </label>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-secondary)] pointer-events-none">
              {mode === "ai" ? (
                <svg
                  className="w-4 h-4 text-[var(--accent-primary)]"
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
              ) : (
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </div>
            <input
              id="playground-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSelectVibe(null);
                onSearchQueryChange(e.target.value);
              }}
              placeholder={
                mode === "ai"
                  ? "Try: quiet en-suite room near USM with fast WiFi under 1.5M..."
                  : "Search by boarding house name, street, or facility..."
              }
              className={`w-full pl-10 pr-20 py-3 rounded-[10px] border text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/75 bg-[var(--bg-canvas)] focus:outline-none focus:ring-2 transition-colors ${
                mode === "ai"
                  ? "border-[var(--accent-primary)]/40 focus:ring-[var(--accent-primary)]/25 focus:border-[var(--accent-primary)]"
                  : "border-[var(--border-stone)] focus:ring-[var(--ink-primary)]/15 focus:border-[var(--ink-primary)]"
              }`}
            />
            {(searchQuery || selectedDistrict !== "All Districts" || maxBudget !== null || activeVibeId !== null) && (
              <button
                type="button"
                onClick={onResetAll}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] px-2 py-1 rounded-[8px] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Standard Mode Controls */}
          {mode === "filter" && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="playground-district" className="sr-only">
                District
              </label>
              <select
                id="playground-district"
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="px-3.5 py-3 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-sm text-[var(--ink-primary)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
              >
                {DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Mode-specific secondary strip */}
        {mode === "ai" ? (
          <div key="ai-vibes" className="space-y-2">
            <p className="text-xs font-medium text-[var(--ink-secondary)]">
              Quick-vibe prompts — click one to filter & re-rank by intent:
            </p>
            <div className="flex flex-wrap gap-2">
              {VIBE_PRESETS.map((preset, index) => {
                const isActive = activeVibeId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectVibe(isActive ? null : preset)}
                    style={{ "--stagger-index": index } as React.CSSProperties}
                    className={`pg-chip-stagger px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white"
                        : "bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-tint)]/50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div key="filter-budgets" className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--ink-secondary)] mr-1">
              Monthly cap:
            </span>
            {BUDGET_PRESETS.map((preset) => {
              const isSelected = maxBudget === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onMaxBudgetChange(preset.value)}
                  className={`pg-mono px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[var(--ink-primary)] border-[var(--ink-primary)] text-white"
                      : "bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Expandable SPK Priority Weight Tuner */}
        {isTunerOpen && (
          <div className="pt-4 mt-2 border-t border-[var(--border-stone)]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--ink-primary)]">
                  Live SPK Profile Matching Priorities
                </h3>
                <p className="text-xs text-[var(--ink-secondary)]">
                  Drag any priority slider to watch match percentages and card
                  ranking recalculate immediately.
                </p>
              </div>
              {!isDefaultWeights && (
                <button
                  type="button"
                  onClick={() => onWeightsChange(DEFAULT_SPK_WEIGHTS)}
                  className="text-xs font-medium text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  Reset weights (30 / 25 / 25 / 20)
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                [
                  { key: "price", label: "Price Fit", pct: normalizedPct.price },
                  {
                    key: "location",
                    label: "Campus Distance",
                    pct: normalizedPct.location,
                  },
                  {
                    key: "facilities",
                    label: "Facilities",
                    pct: normalizedPct.facilities,
                  },
                  {
                    key: "rating",
                    label: "Resident Rating",
                    pct: normalizedPct.rating,
                  },
                ] as const
              ).map((criterion) => (
                <div
                  key={criterion.key}
                  className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor={`spk-weight-${criterion.key}`}
                      className="text-xs font-semibold text-[var(--ink-primary)]"
                    >
                      {criterion.label}
                    </label>
                    <span className="pg-mono text-xs font-semibold text-[var(--accent-primary)]">
                      {criterion.pct}%
                    </span>
                  </div>
                  <input
                    id={`spk-weight-${criterion.key}`}
                    type="range"
                    min={5}
                    max={80}
                    step={5}
                    value={weights[criterion.key]}
                    onChange={(e) =>
                      handleSliderChange(criterion.key, Number(e.target.value))
                    }
                    className="pg-slider"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
