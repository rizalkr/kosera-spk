'use client';

import type { SectionProps } from './types';

/**
 * Room preferences section with rating and availability
 */
export const RoomSection = ({ formData, onChange }: SectionProps) => {
  return (
    <>
      {/* Rating Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Minimum</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={formData.minRating ?? 3}
            onChange={(e) => onChange({ minRating: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg font-semibold text-yellow-500 min-w-[3rem]">
            {formData.minRating ?? 3} *
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Kos dengan rating di bawah ini akan mendapat skor lebih rendah
        </p>
      </div>

      {/* Availability Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ketersediaan</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.needsAvailableRoom ?? true}
            onChange={(e) => onChange({ needsAvailableRoom: e.target.checked })}
            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">Hanya tampilkan kos yang masih tersedia kamarnya</span>
        </label>
      </div>
    </>
  );
};
