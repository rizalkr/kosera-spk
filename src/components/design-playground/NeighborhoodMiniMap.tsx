"use client";

import { formatRupiah, type PlaygroundKos } from "./playgroundData";

interface MapKosItem extends PlaygroundKos {
  matchScore: number;
}

interface NeighborhoodMiniMapProps {
  items: MapKosItem[];
  topMatchId: number | null;
  hoveredKosId: number | null;
  previewKosId: number;
  onHoverChange: (id: number | null) => void;
  onSelectPin: (id: number) => void;
}

const LANDMARKS = [
  { name: "Simpang Lima", x: 24, y: 26 },
  { name: "USM Campus", x: 72, y: 20 },
  { name: "Undip Tembalang", x: 48, y: 88 },
];

export default function NeighborhoodMiniMap({
  items,
  topMatchId,
  hoveredKosId,
  previewKosId,
  onHoverChange,
  onSelectPin,
}: NeighborhoodMiniMapProps) {
  const activeItem =
    items.find((k) => k.id === hoveredKosId) ||
    items.find((k) => k.id === previewKosId) ||
    items[0] ||
    null;

  const formatCompactPrice = (price: number) => {
    const millions = price / 1000000;
    return `Rp ${millions.toFixed(2).replace(/\.00$/, "")}M`;
  };

  return (
    <aside
      aria-label="Semarang campus corridor map"
      className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-4 space-y-3 lg:sticky lg:top-20"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[var(--ink-primary)]">
            Semarang Campus Map
          </h3>
          <p className="text-xs text-[var(--ink-secondary)]">
            Hover a card or pin to sync locations
          </p>
        </div>
        <span className="pg-mono text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)]">
          Live Sync
        </span>
      </div>

      {/* Warm Paper Architectural Map Canvas */}
      <div className="relative w-full aspect-[4/4.2] rounded-[14px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] overflow-hidden">
        <svg
          viewBox="0 0 400 420"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {/* Soft campus corridor fields */}
          <circle cx="296" cy="160" r="68" fill="#E3F0EB" opacity="0.72" />
          <circle cx="216" cy="352" r="64" fill="#E3F0EB" opacity="0.62" />
          <circle cx="120" cy="168" r="54" fill="#EFECE4" opacity="0.85" />

          {/* Architectural street corridors */}
          <path
            d="M 24 140 Q 140 165 290 148 T 388 180"
            fill="none"
            stroke="#E6E2D8"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 118 24 C 132 135 162 230 220 390"
            fill="none"
            stroke="#E6E2D8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 290 40 Q 275 180 342 360"
            fill="none"
            stroke="#E6E2D8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 30 250 Q 190 235 370 258"
            fill="none"
            stroke="#EFECE4"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Campus & City Landmarks */}
        {LANDMARKS.map((landmark) => (
          <div
            key={landmark.name}
            style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-1"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-secondary)]/45 ring-4 ring-[var(--bg-surface)]/70" />
            <span className="text-[10px] font-semibold text-[var(--ink-secondary)] bg-[var(--bg-surface)]/85 px-2 py-0.5 rounded-full border border-[var(--border-stone)] whitespace-nowrap">
              {landmark.name}
            </span>
          </div>
        ))}

        {/* Interactive Price Pins */}
        {items.map((kos) => {
          const isHovered = hoveredKosId === kos.id;
          const isPreview = previewKosId === kos.id;
          const isTop = topMatchId === kos.id;
          const isActive = isHovered || isPreview;

          return (
            <button
              key={kos.id}
              type="button"
              onMouseEnter={() => onHoverChange(kos.id)}
              onMouseLeave={() => onHoverChange(null)}
              onFocus={() => onHoverChange(kos.id)}
              onBlur={() => onHoverChange(null)}
              onClick={() => onSelectPin(kos.id)}
              style={{
                left: `${kos.mapPosition.x}%`,
                top: `${kos.mapPosition.y}%`,
              }}
              aria-label={`${kos.name}, ${formatRupiah(kos.monthlyPrice)} per month, ${kos.matchScore}% match`}
              className={`pg-spring-transition absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none ${
                isActive ? "z-30 scale-110" : "z-20 hover:scale-105"
              }`}
            >
              {isHovered && (
                <span
                  aria-hidden="true"
                  className="pg-pin-active-ring absolute inset-0 rounded-full bg-[var(--accent-primary)]"
                />
              )}
              <span
                className={`pg-mono relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white"
                    : isTop
                      ? "bg-[var(--accent-spark)] border-[var(--accent-spark)] text-white"
                      : "bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-primary)]"
                }`}
              >
                {formatCompactPrice(kos.monthlyPrice)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Synchronized Pin Inspector Footer */}
      {activeItem ? (
        <div className="rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold text-[var(--ink-primary)] truncate">
              {activeItem.name}
            </div>
            <div className="pg-mono text-[11px] text-[var(--ink-secondary)] mt-0.5">
              {activeItem.distanceKm.toFixed(1)} km to {activeItem.landmark}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="pg-mono text-xs font-bold text-[var(--accent-primary)]">
              {activeItem.matchScore}% Match
            </div>
            <div className="pg-mono text-[11px] text-[var(--ink-secondary)]">
              {formatRupiah(activeItem.monthlyPrice)}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] p-3 text-xs text-[var(--ink-secondary)]">
          No rooms match the current filter criteria. Reset filters to restore
          pins.
        </div>
      )}
    </aside>
  );
}
