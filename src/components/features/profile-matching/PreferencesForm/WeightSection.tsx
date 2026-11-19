'use client';

import { normalizeWeightsTo100 } from '@/lib/utils/discovery';
import type { SectionProps, WeightKey } from './types';

/**
 * Weight section with SPK criteria sliders and 100% validation indicator
 */
export const WeightSection = ({ formData, onChange }: SectionProps) => {
  const handleWeightChange = (key: WeightKey, value: number) => {
    onChange({ [key]: value });
  };

  const totalWeight = getTotalWeight(formData);
  const isValidTotal = totalWeight === 100;

  const weightItems: { key: WeightKey; label: string; defaultValue: number }[] = [
    { key: 'weightPrice', label: 'Harga', defaultValue: 30 },
    { key: 'weightLocation', label: 'Lokasi', defaultValue: 25 },
    { key: 'weightFacilities', label: 'Fasilitas', defaultValue: 25 },
    { key: 'weightRating', label: 'Rating', defaultValue: 20 },
  ];

  const handleNormalize = () => {
    const normalized = normalizeWeightsTo100({
      price: formData.weightPrice ?? 30,
      location: formData.weightLocation ?? 25,
      facilities: formData.weightFacilities ?? 25,
      rating: formData.weightRating ?? 20,
    });
    onChange({
      weightPrice: normalized.price,
      weightLocation: normalized.location,
      weightFacilities: normalized.facilities,
      weightRating: normalized.rating,
    });
  };

  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[var(--ink-primary)]">Bobot Kriteria SPK</h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Sesuaikan prioritas tiap kriteria pencocokan hingga total mencapai{' '}
          <span className="font-mono-tabular font-semibold">100%</span>.
        </p>
      </div>

      <div className="space-y-4">
        {weightItems.map(({ key, label, defaultValue }) => {
          const val = formData[key] ?? defaultValue;
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor={`weight-${key}`}
                  className="text-xs font-semibold text-[var(--ink-primary)]"
                >
                  {label}
                </label>
                <span className="font-mono-tabular text-xs font-bold text-[var(--accent-primary)]">
                  {val}%
                </span>
              </div>
              <input
                id={`weight-${key}`}
                type="range"
                min="0"
                max="100"
                step="5"
                value={val}
                onChange={(e) => handleWeightChange(key, Number(e.target.value))}
                className="tactile-slider"
              />
            </div>
          );
        })}
      </div>

      <div
        className={`mt-5 p-3.5 rounded-[12px] border flex flex-wrap items-center justify-between gap-3 ${
          isValidTotal
            ? 'bg-[var(--accent-tint)] border-[#BBDCD0] text-[var(--accent-primary)]'
            : 'bg-[var(--accent-danger-tint)] border-[#ECC6C0] text-[var(--accent-danger)]'
        }`}
      >
        <p className="text-xs sm:text-sm font-semibold">
          Total Bobot: <span className="font-mono-tabular">{totalWeight}%</span>
          {!isValidTotal && ' (harus tepat 100%)'}
        </p>
        {!isValidTotal && (
          <button
            type="button"
            onClick={handleNormalize}
            className="px-3 py-1.5 rounded-[8px] text-xs font-semibold bg-[var(--bg-surface)] text-[var(--ink-primary)] border border-[var(--border-stone)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
          >
            Normalisasi ke 100%
          </button>
        )}
      </div>
    </section>
  );
};

/**
 * Get total weight from form data
 */
export const getTotalWeight = (formData: {
  weightPrice?: number | null;
  weightLocation?: number | null;
  weightFacilities?: number | null;
  weightRating?: number | null;
}): number => {
  return (
    (formData.weightPrice ?? 30) +
    (formData.weightLocation ?? 25) +
    (formData.weightFacilities ?? 25) +
    (formData.weightRating ?? 20)
  );
};
