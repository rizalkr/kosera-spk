"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TokenSpecimen from "@/components/design-playground/TokenSpecimen";
import MorphingSearchBar from "@/components/design-playground/MorphingSearchBar";
import PlaygroundKosCard from "@/components/design-playground/PlaygroundKosCard";
import NeighborhoodMiniMap from "@/components/design-playground/NeighborhoodMiniMap";
import FloatingCompareDock from "@/components/design-playground/FloatingCompareDock";
import StickyDetailPreview from "@/components/design-playground/StickyDetailPreview";
import {
  computeWeightedMatchScore,
  DEFAULT_SPK_WEIGHTS,
  PLAYGROUND_KOS_LIST,
  VIBE_PRESETS,
  type SpkWeights,
  type VibePreset,
} from "@/components/design-playground/playgroundData";

export default function DesignPlaygroundPage() {
  const [searchMode, setSearchMode] = useState<"filter" | "ai">("filter");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [activeVibeId, setActiveVibeId] = useState<string | null>(null);
  const [weights, setWeights] = useState<SpkWeights>(DEFAULT_SPK_WEIGHTS);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([101]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [hoveredKosId, setHoveredKosId] = useState<number | null>(null);
  const [previewKosId, setPreviewKosId] = useState<number>(101);

  const handleModeChange = (nextMode: "filter" | "ai") => {
    setSearchMode(nextMode);
    if (nextMode === "filter") {
      setActiveVibeId(null);
    }
  };

  const handleSelectVibe = (preset: VibePreset | null) => {
    if (!preset) {
      setActiveVibeId(null);
      return;
    }
    setActiveVibeId(preset.id);
    setSearchQuery(preset.query);
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedDistrict("All Districts");
    setMaxBudget(null);
    setActiveVibeId(null);
  };

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSelectPreview = (id: number, shouldScroll = false) => {
    setPreviewKosId(id);
    if (shouldScroll) {
      const target = document.getElementById("detail-preview");
      if (target) {
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        target.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  };

  const scoredAndFiltered = useMemo(() => {
    const activeVibe =
      VIBE_PRESETS.find((preset) => preset.id === activeVibeId) || null;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return PLAYGROUND_KOS_LIST.map((kos) => ({
      ...kos,
      matchScore: computeWeightedMatchScore(kos, weights),
    }))
      .filter((kos) => {
        if (searchMode === "filter") {
          if (
            selectedDistrict !== "All Districts" &&
            kos.district !== selectedDistrict
          ) {
            return false;
          }
          if (maxBudget !== null && kos.monthlyPrice > maxBudget) {
            return false;
          }
        }

        if (searchMode === "ai" && activeVibe) {
          const matchesVibeTag = kos.vibeTags.includes(activeVibe.tagMatch);
          const matchesVibeBudget = activeVibe.maxPrice
            ? kos.monthlyPrice <= activeVibe.maxPrice
            : true;
          return matchesVibeTag && matchesVibeBudget;
        }

        if (normalizedQuery) {
          const searchable = [
            kos.name,
            kos.district,
            kos.address,
            kos.landmark,
            kos.description,
            kos.genderPolicy,
            ...kos.facilities,
            ...kos.vibeTags,
          ]
            .join(" ")
            .toLowerCase();

          const tokens = normalizedQuery
            .split(/\s+/)
            .filter((t) => t.length >= 2);
          if (tokens.length === 0) return true;

          if (searchMode === "ai") {
            const matchedBudget = normalizedQuery.includes("1.5")
              ? kos.monthlyPrice <= 1500000
              : true;
            const anyRelevant = tokens.some((token) =>
              searchable.includes(token)
            );
            return matchedBudget && anyRelevant;
          }

          return tokens.every((token) => searchable.includes(token));
        }

        return true;
      })
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return b.rating - a.rating;
      });
  }, [
    searchMode,
    searchQuery,
    selectedDistrict,
    maxBudget,
    activeVibeId,
    weights,
  ]);

  const topMatchId = scoredAndFiltered[0]?.id ?? null;

  const comparedKosList = useMemo(() => {
    return compareIds
      .map((id) => {
        const kos = PLAYGROUND_KOS_LIST.find((item) => item.id === id);
        if (!kos) return null;
        return {
          ...kos,
          matchScore: computeWeightedMatchScore(kos, weights),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [compareIds, weights]);

  const activePreviewKos = useMemo(() => {
    const found =
      PLAYGROUND_KOS_LIST.find((k) => k.id === previewKosId) ||
      PLAYGROUND_KOS_LIST[0];
    return {
      kos: found,
      matchScore: computeWeightedMatchScore(found, weights),
    };
  }, [previewKosId, weights]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-canvas)]/95 backdrop-blur-sm border-b border-[var(--border-stone)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-[-0.02em] text-[var(--ink-primary)]">
              KOSERA
            </span>
            <span className="text-xs font-medium text-[var(--ink-secondary)] px-2.5 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border-stone)]">
              Design Playground
            </span>
          </div>

          <nav
            aria-label="Playground sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--ink-secondary)]"
          >
            <a
              href="#tokens"
              className="hover:text-[var(--ink-primary)] transition-colors"
            >
              Tokens
            </a>
            <a
              href="#discovery"
              className="hover:text-[var(--ink-primary)] transition-colors"
            >
              Discovery &amp; Map
            </a>
            <a
              href="#detail-preview"
              className="hover:text-[var(--ink-primary)] transition-colors"
            >
              Detail Preview
            </a>
          </nav>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors whitespace-nowrap"
          >
            Back to Live App
          </Link>
        </div>
      </header>

      {/* Main Playground Flow */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-28 space-y-20">
        {/* Hero Intro */}
        <section className="max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.04] text-[var(--ink-primary)]">
            Warm Tactile Tech
          </h1>
          <p className="text-base sm:text-lg text-[var(--ink-secondary)] leading-[1.58]">
            Interactive sandbox testing Kosera&apos;s warm daylight tokens,
            tabular pricing typography, AI search morphing, progressive SPK
            score disclosure, and side-by-side room comparison without modifying
            live production pages.
          </p>
        </section>

        {/* Module 1: Token Specimen */}
        <TokenSpecimen />

        {/* Module 2 + Module 3: Discovery Stage + Progressive Cards + Map Sync */}
        <section
          id="discovery"
          aria-labelledby="discovery-heading"
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                id="discovery-heading"
                className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[var(--ink-primary)]"
              >
                2. Discovery Stage, Progressive SPK &amp; Map Sync
              </h2>
              <p className="mt-2 text-base text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
                Switch between Standard Filter and Natural AI Search, adjust SPK
                weights to watch cards re-rank live, and hover any card or map
                pin to inspect spatial continuity.
              </p>
            </div>
            <span className="text-xs font-medium text-[var(--ink-secondary)] bg-[var(--bg-muted)] px-3 py-1.5 rounded-full self-start md:self-auto">
              Select 2–3 cards with + Compare to test the floating dock
            </span>
          </div>

          <MorphingSearchBar
            mode={searchMode}
            onModeChange={handleModeChange}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
            maxBudget={maxBudget}
            onMaxBudgetChange={setMaxBudget}
            activeVibeId={activeVibeId}
            onSelectVibe={handleSelectVibe}
            weights={weights}
            onWeightsChange={setWeights}
            onResetAll={handleResetAll}
            resultCount={scoredAndFiltered.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cards Column */}
            <div className="lg:col-span-8">
              {scoredAndFiltered.length === 0 ? (
                <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-10 text-center space-y-3">
                  <h3 className="text-lg font-bold text-[var(--ink-primary)]">
                    No boarding rooms match that prompt
                  </h3>
                  <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto">
                    Try another quick-vibe chip or clear the current filter to
                    view all four Semarang sample listings.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="mt-2 px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                  >
                    Reset search &amp; filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {scoredAndFiltered.map((kos) => (
                    <PlaygroundKosCard
                      key={kos.id}
                      kos={kos}
                      matchScore={kos.matchScore}
                      isTopMatch={kos.id === topMatchId}
                      isFavorited={favoriteIds.includes(kos.id)}
                      isCompared={compareIds.includes(kos.id)}
                      compareDisabled={compareIds.length >= 3}
                      isMapHighlighted={hoveredKosId === kos.id}
                      isPreviewActive={previewKosId === kos.id}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleCompare={handleToggleCompare}
                      onSelectPreview={(id) => handleSelectPreview(id, true)}
                      onHoverChange={setHoveredKosId}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Map Column */}
            <div className="lg:col-span-4">
              <NeighborhoodMiniMap
                items={scoredAndFiltered}
                topMatchId={topMatchId}
                hoveredKosId={hoveredKosId}
                previewKosId={previewKosId}
                onHoverChange={setHoveredKosId}
                onSelectPin={(id) => handleSelectPreview(id, false)}
              />
            </div>
          </div>
        </section>

        {/* Module 5: Sticky Detail Preview */}
        <StickyDetailPreview
          kos={activePreviewKos.kos}
          matchScore={activePreviewKos.matchScore}
          weights={weights}
          isFavorited={favoriteIds.includes(activePreviewKos.kos.id)}
          isCompared={compareIds.includes(activePreviewKos.kos.id)}
          compareDisabled={compareIds.length >= 3}
          onToggleFavorite={handleToggleFavorite}
          onToggleCompare={handleToggleCompare}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-stone)] bg-[var(--bg-surface)] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--ink-secondary)]">
          <div>
            <span className="font-bold text-[var(--ink-primary)] mr-2">
              KOSERA
            </span>
            Warm Tactile Tech Design Exploration Sandbox
          </div>
          <Link
            href="/"
            className="font-semibold text-[var(--accent-primary)] hover:underline"
          >
            Return to existing production homepage
          </Link>
        </div>
      </footer>

      {/* Module 4: Floating Compare Dock & Comparison Modal */}
      <FloatingCompareDock
        selectedKosList={comparedKosList}
        onRemove={handleToggleCompare}
        onClear={() => setCompareIds([])}
      />
    </div>
  );
}
