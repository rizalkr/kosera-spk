'use client';

import { AVAILABLE_FACILITIES } from '@/types/profile-matching';
import type { SectionProps } from './types';

/**
 * Facilities section with required and optional facility selection
 */
export const FacilitiesSection = ({ formData, onChange }: SectionProps) => {
  const toggleRequiredFacility = (facility: string) => {
    const current = formData.requiredFacilities ?? [];
    const optional = formData.optionalFacilities ?? [];

    if (current.includes(facility)) {
      onChange({ requiredFacilities: current.filter((f) => f !== facility) });
    } else {
      onChange({
        requiredFacilities: [...current, facility],
        optionalFacilities: optional.filter((f) => f !== facility),
      });
    }
  };

  const toggleOptionalFacility = (facility: string) => {
    const current = formData.optionalFacilities ?? [];
    const required = formData.requiredFacilities ?? [];

    if (required.includes(facility)) return;

    if (current.includes(facility)) {
      onChange({ optionalFacilities: current.filter((f) => f !== facility) });
    } else {
      onChange({ optionalFacilities: [...current, facility] });
    }
  };

  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 sm:p-6 space-y-5">
      <div>
        <h3 className="text-base font-bold text-[var(--ink-primary)]">Fasilitas</h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Bedakan fasilitas yang wajib tersedia dan fasilitas pendukung opsional.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-[var(--ink-primary)] mb-2">
          Fasilitas Wajib (harus tersedia):
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FACILITIES.map((facility) => {
            const active = Boolean(formData.requiredFacilities?.includes(facility));
            return (
              <button
                key={`req-${facility}`}
                type="button"
                aria-pressed={active}
                onClick={() => toggleRequiredFacility(facility)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border-[var(--border-stone)] hover:border-[var(--ink-secondary)]'
                }`}
              >
                {facility}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border-stone)]">
        <p className="text-xs font-semibold text-[var(--ink-primary)] mb-2">
          Fasilitas Opsional (nilai tambah):
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FACILITIES.filter((f) => !formData.requiredFacilities?.includes(f)).map(
            (facility) => {
              const active = Boolean(formData.optionalFacilities?.includes(facility));
              return (
                <button
                  key={`opt-${facility}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleOptionalFacility(facility)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-spark)] text-white border-[var(--accent-spark)]'
                      : 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border-[var(--border-stone)] hover:border-[var(--ink-secondary)]'
                  }`}
                >
                  {facility}
                </button>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};
