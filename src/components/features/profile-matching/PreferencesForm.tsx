'use client';

import { useState, useEffect } from 'react';
import { usePreferencesManager } from '@/hooks/profile-matching';
import { AVAILABLE_CITIES, AVAILABLE_FACILITIES } from '@/types/profile-matching';
import type { UserPreferencesInput } from '@/types/profile-matching';
import { showSuccess, showError } from '@/lib/sweetalert';

/**
 * Props for PreferencesForm component
 */
interface PreferencesFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Form component for setting user preferences for profile matching
 */
export const PreferencesForm = ({ onSuccess, onCancel, className = '' }: PreferencesFormProps) => {
  const { preferences, isLoading, savePreferences, isSaving } = usePreferencesManager();

  // Form state
  const [formData, setFormData] = useState<UserPreferencesInput>({
    budgetMin: null,
    budgetMax: null,
    preferredCities: [],
    requiredFacilities: [],
    optionalFacilities: [],
    roomType: 'any',
    minRating: 3.0,
    needsAvailableRoom: true,
    weightPrice: 30,
    weightLocation: 25,
    weightFacilities: 25,
    weightRating: 20,
  });

  // Initialize form with existing preferences
  useEffect(() => {
    if (preferences) {
      setFormData({
        budgetMin: preferences.budgetMin,
        budgetMax: preferences.budgetMax,
        preferredCities: preferences.preferredCities,
        requiredFacilities: preferences.requiredFacilities,
        optionalFacilities: preferences.optionalFacilities,
        roomType: preferences.roomType,
        minRating: preferences.minRating,
        needsAvailableRoom: preferences.needsAvailableRoom,
        weightPrice: preferences.weightPrice,
        weightLocation: preferences.weightLocation,
        weightFacilities: preferences.weightFacilities,
        weightRating: preferences.weightRating,
      });
    }
  }, [preferences]);

  // Handle city selection
  const toggleCity = (city: string) => {
    const current = formData.preferredCities ?? [];
    if (current.includes(city)) {
      setFormData({ ...formData, preferredCities: current.filter((c) => c !== city) });
    } else {
      setFormData({ ...formData, preferredCities: [...current, city] });
    }
  };

  // Handle facility selection (required)
  const toggleRequiredFacility = (facility: string) => {
    const current = formData.requiredFacilities ?? [];
    const optional = formData.optionalFacilities ?? [];
    
    if (current.includes(facility)) {
      setFormData({ ...formData, requiredFacilities: current.filter((f) => f !== facility) });
    } else {
      // Remove from optional if present
      setFormData({
        ...formData,
        requiredFacilities: [...current, facility],
        optionalFacilities: optional.filter((f) => f !== facility),
      });
    }
  };

  // Handle facility selection (optional)
  const toggleOptionalFacility = (facility: string) => {
    const current = formData.optionalFacilities ?? [];
    const required = formData.requiredFacilities ?? [];
    
    // Don't add to optional if already required
    if (required.includes(facility)) return;
    
    if (current.includes(facility)) {
      setFormData({ ...formData, optionalFacilities: current.filter((f) => f !== facility) });
    } else {
      setFormData({ ...formData, optionalFacilities: [...current, facility] });
    }
  };

  // Handle weight change (ensure they sum to 100)
  const handleWeightChange = (key: keyof Pick<UserPreferencesInput, 'weightPrice' | 'weightLocation' | 'weightFacilities' | 'weightRating'>, value: number) => {
    const weights = {
      weightPrice: formData.weightPrice ?? 30,
      weightLocation: formData.weightLocation ?? 25,
      weightFacilities: formData.weightFacilities ?? 25,
      weightRating: formData.weightRating ?? 20,
    };
    
    weights[key] = value;
    
    // Check if total is 100
    const total = weights.weightPrice + weights.weightLocation + weights.weightFacilities + weights.weightRating;
    
    if (total !== 100) {
      // Show warning but still allow change
      console.warn(`Weights sum to ${total}, should be 100`);
    }
    
    setFormData({ ...formData, [key]: value });
  };

  // Calculate total weight
  const totalWeight = (formData.weightPrice ?? 30) + (formData.weightLocation ?? 25) + 
                      (formData.weightFacilities ?? 25) + (formData.weightRating ?? 20);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalWeight !== 100) {
      showError('Total bobot kriteria harus 100%');
      return;
    }

    try {
      await savePreferences(formData);
      showSuccess('Preferensi berhasil disimpan!');
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save preferences:', error);
      showError('Gagal menyimpan preferensi');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Budget Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Minimum (Rp)
            </label>
            <input
              type="number"
              value={formData.budgetMin ?? ''}
              onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value ? Number(e.target.value) : null })}
              placeholder="Contoh: 500000"
              className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Maximum (Rp)
            </label>
            <input
              type="number"
              value={formData.budgetMax ?? ''}
              onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value ? Number(e.target.value) : null })}
              placeholder="Contoh: 2000000"
              className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lokasi Preferensi</h3>
        <p className="text-sm text-gray-600 mb-3">Pilih kota yang Anda inginkan:</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                formData.preferredCities?.includes(city)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Section */}
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
            {AVAILABLE_FACILITIES.filter((f) => !formData.requiredFacilities?.includes(f)).map((facility) => (
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
            ))}
          </div>
        </div>
      </div>

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
            onChange={(e) => setFormData({ ...formData, minRating: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg font-semibold text-yellow-500 min-w-[3rem]">
            {formData.minRating ?? 3} ★
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
            onChange={(e) => setFormData({ ...formData, needsAvailableRoom: e.target.checked })}
            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">Hanya tampilkan kos yang masih tersedia kamarnya</span>
        </label>
      </div>

      {/* Weights Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bobot Kriteria</h3>
        <p className="text-sm text-gray-600 mb-4">
          Atur bobot untuk setiap kriteria (total harus 100%)
        </p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Harga</label>
              <span className="text-sm text-gray-500">{formData.weightPrice ?? 30}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.weightPrice ?? 30}
              onChange={(e) => handleWeightChange('weightPrice', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Lokasi</label>
              <span className="text-sm text-gray-500">{formData.weightLocation ?? 25}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.weightLocation ?? 25}
              onChange={(e) => handleWeightChange('weightLocation', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Fasilitas</label>
              <span className="text-sm text-gray-500">{formData.weightFacilities ?? 25}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.weightFacilities ?? 25}
              onChange={(e) => handleWeightChange('weightFacilities', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Rating</label>
              <span className="text-sm text-gray-500">{formData.weightRating ?? 20}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.weightRating ?? 20}
              onChange={(e) => handleWeightChange('weightRating', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-700' : 'text-red-700'}`}>
            Total Bobot: {totalWeight}%
            {totalWeight !== 100 && ' (harus 100%)'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSaving || totalWeight !== 100}
          className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Preferensi'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default PreferencesForm;
