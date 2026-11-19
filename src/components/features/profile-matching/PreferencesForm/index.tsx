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

interface PreferencesFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

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
 */
export const PreferencesForm = ({ onSuccess, onCancel, className = '' }: PreferencesFormProps) => {
  const { preferences, isLoading, savePreferences, isSaving } = usePreferencesManager();
  const [formData, setFormData] = useState<UserPreferencesInput>(DEFAULT_FORM_DATA);

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

  const handleChange = useCallback((partial: Partial<UserPreferencesInput>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const totalWeight = getTotalWeight(formData);

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
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-6 animate-pulse space-y-4">
        <div className="h-6 bg-[var(--bg-muted)] rounded w-1/3" />
        <div className="h-12 bg-[var(--bg-muted)] rounded-[10px]" />
        <div className="h-12 bg-[var(--bg-muted)] rounded-[10px]" />
        <div className="h-28 bg-[var(--bg-muted)] rounded-[12px]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
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

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={isSaving || totalWeight !== 100}
          className="flex-1 min-w-[180px] py-3 px-6 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Preferensi'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-[10px] text-sm font-medium border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default PreferencesForm;
