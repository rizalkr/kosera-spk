import type { UserPreferencesInput } from '@/types/profile-matching';

/**
 * Location mode for preference selection
 */
export type LocationMode = 'none' | 'current' | 'manual' | 'preset';

/**
 * Preset location definition
 */
export interface PresetLocation {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Preset locations - campus and popular places in Semarang
 */
export const PRESET_LOCATIONS: PresetLocation[] = [
  { name: 'USM (Universitas Semarang)', lat: -6.9932, lng: 110.4595 },
  { name: 'UNDIP Tembalang', lat: -7.0499, lng: 110.4381 },
  { name: 'UNNES Sekaran', lat: -7.0489, lng: 110.3925 },
  { name: 'UNIKA Soegijapranata', lat: -6.9847, lng: 110.4103 },
  { name: 'Polines', lat: -6.9821, lng: 110.4189 },
  { name: 'UPGRIS', lat: -6.9912, lng: 110.4612 },
  { name: 'Simpang Lima', lat: -6.9932, lng: 110.4203 },
  { name: 'Stasiun Tawang', lat: -6.9644, lng: 110.4278 },
];

/**
 * Props for form section components
 */
export interface SectionProps {
  formData: UserPreferencesInput;
  onChange: (data: Partial<UserPreferencesInput>) => void;
}

/**
 * Weight keys for criteria weights
 */
export type WeightKey = 'weightPrice' | 'weightLocation' | 'weightFacilities' | 'weightRating';
