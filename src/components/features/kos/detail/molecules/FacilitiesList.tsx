import React from 'react';

export interface FacilitiesListProps {
  facilities: string | undefined;
}

export const FacilitiesList: React.FC<FacilitiesListProps> = ({
  facilities,
}) => {
  if (!facilities) return null;

  const items = facilities
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-[var(--ink-primary)]">
        Fasilitas Kamar &amp; Bangunan
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {items.map((facility, index) => (
          <div
            key={`${facility}-${index}`}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-xs sm:text-sm font-medium text-[var(--ink-primary)]"
          >
            <svg
              className="w-4 h-4 text-[var(--accent-primary)] shrink-0"
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
            <span className="truncate">{facility}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
