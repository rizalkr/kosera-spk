'use client';

import type { SectionProps, WeightKey } from './types';

/**
 * Weight section with criteria weight sliders
 */
export const WeightSection = ({ formData, onChange }: SectionProps) => {
  const handleWeightChange = (key: WeightKey, value: number) => {
    onChange({ [key]: value });
  };

  const totalWeight =
    (formData.weightPrice ?? 30) +
    (formData.weightLocation ?? 25) +
    (formData.weightFacilities ?? 25) +
    (formData.weightRating ?? 20);

  const weightItems: { key: WeightKey; label: string; defaultValue: number }[] = [
    { key: 'weightPrice', label: 'Harga', defaultValue: 30 },
    { key: 'weightLocation', label: 'Lokasi', defaultValue: 25 },
    { key: 'weightFacilities', label: 'Fasilitas', defaultValue: 25 },
    { key: 'weightRating', label: 'Rating', defaultValue: 20 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bobot Kriteria</h3>
      <p className="text-sm text-gray-600 mb-4">Atur bobot untuk setiap kriteria (total harus 100%)</p>

      <div className="space-y-4">
        {weightItems.map(({ key, label, defaultValue }) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <span className="text-sm text-gray-500">{formData[key] ?? defaultValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData[key] ?? defaultValue}
              onChange={(e) => handleWeightChange(key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className={`mt-4 p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-700' : 'text-red-700'}`}>
          Total Bobot: {totalWeight}%
          {totalWeight !== 100 && ' (harus 100%)'}
        </p>
      </div>
    </div>
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
