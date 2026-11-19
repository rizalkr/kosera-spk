'use client';

import type { SectionProps } from './types';

/**
 * Room preferences section with minimum rating slider and availability filter
 */
export const RoomSection = ({ formData, onChange }: SectionProps) => {
  const minRating = formData.minRating ?? 3;

  return (
    <>
      <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <label
            htmlFor="min-rating-slider"
            className="text-base font-bold text-[var(--ink-primary)]"
          >
            Rating Minimum
          </label>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-spark-tint)] border border-[#F2CDBB] text-xs font-semibold text-[#9A471F]">
            <svg
              className="w-3.5 h-3.5 text-[var(--accent-spark)]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-mono-tabular">{minRating.toFixed(1)}</span>
          </span>
        </div>
        <input
          id="min-rating-slider"
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })}
          className="tactile-slider"
        />
        <p className="text-xs text-[var(--ink-secondary)] mt-2">
          Kos dengan rata-rata ulasan di bawah batas ini akan mendapat skor rating lebih rendah.
        </p>
      </section>

      <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 sm:p-6">
        <h3 className="text-base font-bold text-[var(--ink-primary)] mb-3">Ketersediaan Kamar</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.needsAvailableRoom ?? true}
            onChange={(e) => onChange({ needsAvailableRoom: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border-stone)] accent-[var(--accent-primary)]"
          />
          <span className="text-sm text-[var(--ink-primary)]">
            Utamakan kos yang masih memiliki kamar kosong
          </span>
        </label>
      </section>
    </>
  );
};
