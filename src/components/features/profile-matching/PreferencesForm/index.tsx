'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePreferencesManager } from '@/hooks/profile-matching';
import type { UserPreferencesInput } from '@/types/profile-matching';
import { showSuccess, showError } from '@/lib/sweetalert';
import { BudgetSection } from './BudgetSection';
import { LocationSection } from './LocationSection';
import { FacilitiesSection } from './FacilitiesSection';
import { WeightSection, getTotalWeight } from './WeightSection';
import { RoomSection } from './RoomSection';

/**
 * Props for PreferencesForm component
 */
interface PreferencesFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Default form values
 */
const DEFAULT_FORM_DATA: UserPreferencesInput = {
  budgetMin: null,
  budgetMax: null,
  preferredCities: [],
  preferredLatitude: null,
  preferredLongitude: null,
  maxDistanceKm: 10,
  requiredFacilities: [],
  optionalFacilities: [],
  roomType: 'any',
  minRating: 3.0,
  needsAvailableRoom: true,
  weightPrice: 30,
  weightLocation: 25,
  weightFacilities: 25,
  weightRating: 20,
};

/**
 * Form component for setting user preferences for profile matching
 * Refactored to use modular section components
 */
export const PreferencesForm = ({ onSuccess, onCancel, className = '' }: PreferencesFormProps) => {
  const { preferences, isLoading, savePreferences, isSaving } = usePreferencesManager();
  const [formData, setFormData] = useState<UserPreferencesInput>(DEFAULT_FORM_DATA);

  // Initialize form with existing preferences
  useEffect(() => {
    if (preferences) {
      setFormData({
        budgetMin: preferences.budgetMin,
        budgetMax: preferences.budgetMax,
        preferredCities: preferences.preferredCities,
        preferredLatitude: preferences.preferredLatitude ?? null,
        preferredLongitude: preferences.preferredLongitude ?? null,
        maxDistanceKm: preferences.maxDistanceKm ?? 10,
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

  // Handle partial form data changes
  const handleChange = useCallback((partial: Partial<UserPreferencesInput>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  // Calculate total weight
  const totalWeight = getTotalWeight(formData);

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
      <BudgetSection formData={formData} onChange={handleChange} />

      <LocationSection
        formData={formData}
        onChange={handleChange}
        initialLatitude={preferences?.preferredLatitude}
        initialLongitude={preferences?.preferredLongitude}
      />

      <FacilitiesSection formData={formData} onChange={handleChange} />

      <RoomSection formData={formData} onChange={handleChange} />

      <WeightSection formData={formData} onChange={handleChange} />

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
