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
      // Remove from optional if present, add to required
      onChange({
        requiredFacilities: [...current, facility],
        optionalFacilities: optional.filter((f) => f !== facility),
      });
    }
  };

  const toggleOptionalFacility = (facility: string) => {
    const current = formData.optionalFacilities ?? [];
    const required = formData.requiredFacilities ?? [];

    // Don't add to optional if already required
    if (required.includes(facility)) return;

    if (current.includes(facility)) {
      onChange({ optionalFacilities: current.filter((f) => f !== facility) });
    } else {
      onChange({ optionalFacilities: [...current, facility] });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Fasilitas</h3>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Fasilitas Wajib (harus ada):</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FACILITIES.map((facility) => (
            <button
              key={`req-${facility}`}
              type="button"
              onClick={() => toggleRequiredFacility(facility)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                formData.requiredFacilities?.includes(facility)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {facility}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Fasilitas Opsional (nice to have):</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_FACILITIES.filter((f) => !formData.requiredFacilities?.includes(f)).map(
            (facility) => (
              <button
                key={`opt-${facility}`}
                type="button"
                onClick={() => toggleOptionalFacility(facility)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  formData.optionalFacilities?.includes(facility)
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {facility}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
