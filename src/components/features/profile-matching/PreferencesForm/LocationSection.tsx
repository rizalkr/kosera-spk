'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { AVAILABLE_CITIES } from '@/types/profile-matching';
import { PRESET_LOCATIONS, type LocationMode, type SectionProps } from './types';

/**
 * Extended props for LocationSection
 */
interface LocationSectionProps extends SectionProps {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
}

/**
 * Location section with 3 input modes: current, preset, manual
 */
export const LocationSection = ({
  formData,
  onChange,
  initialLatitude,
  initialLongitude,
}: LocationSectionProps) => {
  const geolocation = useGeolocation();
  const [locationMode, setLocationMode] = useState<LocationMode>('none');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Initialize state from existing preferences
  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      setLocationMode('manual');
      setManualLat(initialLatitude.toString());
      setManualLng(initialLongitude.toString());
    }
  }, [initialLatitude, initialLongitude]);

  // Update form when geolocation changes (only in 'current' mode)
  useEffect(() => {
    if (locationMode === 'current' && geolocation.hasLocation) {
      onChange({
        preferredLatitude: geolocation.latitude,
        preferredLongitude: geolocation.longitude,
      });
    }
  }, [locationMode, geolocation.hasLocation, geolocation.latitude, geolocation.longitude, onChange]);

  const handleModeChange = (mode: LocationMode) => {
    setLocationMode(mode);

    if (mode === 'none') {
      onChange({
        preferredLatitude: null,
        preferredLongitude: null,
      });
      setManualLat('');
      setManualLng('');
    } else if (mode === 'current') {
      geolocation.requestLocation();
    }
  };

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onChange({
        preferredLatitude: lat,
        preferredLongitude: lng,
      });
    }
  };

  const handlePresetSelect = (lat: number, lng: number) => {
    onChange({
      preferredLatitude: lat,
      preferredLongitude: lng,
    });
    setManualLat(lat.toString());
    setManualLng(lng.toString());
  };

  const toggleCity = (city: string) => {
    const current = formData.preferredCities ?? [];
    if (current.includes(city)) {
      onChange({ preferredCities: current.filter((c) => c !== city) });
    } else {
      onChange({ preferredCities: [...current, city] });
    }
  };

  const hasLocation = formData.preferredLatitude && formData.preferredLongitude;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Lokasi Preferensi</h3>
      <p className="text-sm text-gray-600 mb-4">
        Pilih lokasi referensi untuk menghitung jarak ke kos. Misalnya lokasi kampus, kantor, atau
        tempat aktivitas utama Anda.
      </p>

      {/* Location Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleModeChange('none')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            locationMode === 'none'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tidak Ada
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('current')}
          disabled={!geolocation.isSupported}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            locationMode === 'current'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Lokasi Saya
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('preset')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            locationMode === 'preset'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pilih Kampus
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('manual')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            locationMode === 'manual'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Input Manual
        </button>
      </div>

      {/* Current Location Mode */}
      {locationMode === 'current' && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          {geolocation.loading ? (
            <div className="flex items-center gap-2 text-blue-700">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Mencari lokasi...
            </div>
          ) : geolocation.error ? (
            <div className="text-red-600 text-sm">{geolocation.error.message}</div>
          ) : geolocation.hasLocation ? (
            <div className="text-green-700 text-sm">
              Lokasi terdeteksi: {geolocation.latitude?.toFixed(6)}, {geolocation.longitude?.toFixed(6)}
              {geolocation.accuracy && (
                <span className="text-xs ml-2">(akurasi: {Math.round(geolocation.accuracy)}m)</span>
              )}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">Klik tombol untuk mendeteksi lokasi Anda</div>
          )}
        </div>
      )}

      {/* Preset Location Mode */}
      {locationMode === 'preset' && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">Pilih lokasi kampus atau tempat populer:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => handlePresetSelect(loc.lat, loc.lng)}
                className={`px-3 py-2 text-left rounded-lg text-sm transition-colors ${
                  formData.preferredLatitude === loc.lat && formData.preferredLongitude === loc.lng
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Input Mode */}
      {locationMode === 'manual' && (
        <div className="mb-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">
            Masukkan koordinat lokasi (bisa copy dari Google Maps):
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
              <input
                type="text"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="-6.9932"
                className="w-full px-3 py-2 text-sm text-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
              <input
                type="text"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="110.4595"
                className="w-full px-3 py-2 text-sm text-gray-700 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualSubmit}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            Terapkan Koordinat
          </button>
          {hasLocation && (
            <div className="mt-2 text-sm text-green-700">
              Koordinat aktif: {formData.preferredLatitude?.toFixed(6)},{' '}
              {formData.preferredLongitude?.toFixed(6)}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Tip: Buka Google Maps, klik kanan lokasi, lalu copy koordinatnya.
          </p>
        </div>
      )}

      {/* Max Distance (shown when any location is set) */}
      {hasLocation && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jarak Maksimum dari Lokasi Referensi
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={formData.maxDistanceKm ?? 10}
              onChange={(e) => onChange({ maxDistanceKm: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-semibold text-blue-600 min-w-[4rem]">
              {formData.maxDistanceKm ?? 10} km
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Kos di luar jarak ini akan mendapat skor lokasi lebih rendah
          </p>
        </div>
      )}

      {/* City Preferences */}
      <div>
        <p className="text-sm text-gray-600 mb-3">
          {hasLocation ? 'Atau pilih kecamatan preferensi (opsional):' : 'Pilih kecamatan yang Anda inginkan:'}
        </p>
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
    </div>
  );
};
