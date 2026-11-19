'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { AVAILABLE_CITIES } from '@/types/profile-matching';
import { PRESET_LOCATIONS, type LocationMode, type SectionProps } from './types';

interface LocationSectionProps extends SectionProps {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
}

const LOCATION_MODES: Array<{ value: LocationMode; label: string }> = [
  { value: 'none', label: 'Tidak Ada' },
  { value: 'current', label: 'Lokasi Saya' },
  { value: 'preset', label: 'Pilih Kampus' },
  { value: 'manual', label: 'Input Manual' },
];

/**
 * Location section with current geolocation, Semarang campus presets, and manual coordinates
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

  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      setLocationMode('manual');
      setManualLat(initialLatitude.toString());
      setManualLng(initialLongitude.toString());
    }
  }, [initialLatitude, initialLongitude]);

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

  const hasLocation =
    typeof formData.preferredLatitude === 'number' &&
    typeof formData.preferredLongitude === 'number';

  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 sm:p-6 space-y-5">
      <div>
        <h3 className="text-base font-bold text-[var(--ink-primary)]">Lokasi Preferensi</h3>
        <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
          Pilih titik referensi kampus atau tempat aktivitas utama untuk menghitung jarak ke kos.
        </p>
      </div>

      {/* Location Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LOCATION_MODES.map((mode) => {
          const active = locationMode === mode.value;
          const disabled = mode.value === 'current' && !geolocation.isSupported;
          return (
            <button
              key={mode.value}
              type="button"
              disabled={disabled}
              onClick={() => handleModeChange(mode.value)}
              className={`px-3 py-2.5 rounded-[10px] text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                active
                  ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                  : 'bg-[var(--bg-muted)] text-[var(--ink-secondary)] border-[var(--border-stone)] hover:text-[var(--ink-primary)]'
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* Current Location Panel */}
      {locationMode === 'current' && (
        <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px]">
          {geolocation.loading ? (
            <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--accent-primary)]">
              <div className="h-4 w-4 rounded-full border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] animate-spin" />
              <span>Mencari koordinat Anda...</span>
            </div>
          ) : geolocation.error ? (
            <div className="text-xs font-medium text-[var(--accent-danger)]">
              {geolocation.error.message}
            </div>
          ) : geolocation.hasLocation ? (
            <div className="text-xs text-[var(--ink-primary)]">
              <span className="font-semibold text-[var(--accent-primary)]">Lokasi terdeteksi:</span>{' '}
              <span className="font-mono-tabular">
                {geolocation.latitude?.toFixed(6)}, {geolocation.longitude?.toFixed(6)}
              </span>
              {geolocation.accuracy && (
                <span className="font-mono-tabular text-[var(--ink-secondary)] ml-2">
                  (akurasi {Math.round(geolocation.accuracy)}m)
                </span>
              )}
            </div>
          ) : (
            <div className="text-xs text-[var(--ink-secondary)]">
              Klik tombol Lokasi Saya untuk mendeteksi titik koordinat perangkat.
            </div>
          )}
        </div>
      )}

      {/* Preset Location Panel */}
      {locationMode === 'preset' && (
        <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] space-y-3">
          <p className="text-xs font-semibold text-[var(--ink-primary)]">
            Pilih lokasi kampus atau titik populer Semarang:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PRESET_LOCATIONS.map((loc) => {
              const selected =
                formData.preferredLatitude === loc.lat &&
                formData.preferredLongitude === loc.lng;
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handlePresetSelect(loc.lat, loc.lng)}
                  className={`px-3.5 py-2.5 text-left rounded-[10px] text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)] text-[var(--ink-primary)] border-[var(--border-stone)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Input Panel */}
      {locationMode === 'manual' && (
        <div className="p-4 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] space-y-3">
          <p className="text-xs font-semibold text-[var(--ink-primary)]">
            Masukkan koordinat lokasi (dapat disalin langsung dari Google Maps):
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="manual-lat"
                className="block text-[11px] font-semibold text-[var(--ink-secondary)] mb-1"
              >
                Latitude
              </label>
              <input
                id="manual-lat"
                type="text"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="-6.9932"
                className="w-full font-mono-tabular px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--ink-primary)] border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]"
              />
            </div>
            <div>
              <label
                htmlFor="manual-lng"
                className="block text-[11px] font-semibold text-[var(--ink-secondary)] mb-1"
              >
                Longitude
              </label>
              <input
                id="manual-lng"
                type="text"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="110.4595"
                className="w-full font-mono-tabular px-3 py-2 text-xs bg-[var(--bg-surface)] text-[var(--ink-primary)] border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualSubmit}
            className="w-full px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            Terapkan Koordinat
          </button>
          {hasLocation && (
            <div className="text-xs text-[var(--accent-primary)] font-medium">
              Koordinat aktif:{' '}
              <span className="font-mono-tabular">
                {formData.preferredLatitude?.toFixed(6)}, {formData.preferredLongitude?.toFixed(6)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Max Distance Slider */}
      {hasLocation && (
        <div className="pt-1 border-t border-[var(--border-stone)]">
          <div className="flex items-center justify-between gap-2 mb-2 mt-3">
            <label
              htmlFor="max-distance-slider"
              className="text-xs font-semibold text-[var(--ink-primary)]"
            >
              Jarak Maksimum dari Lokasi Referensi
            </label>
            <span className="font-mono-tabular text-sm font-bold text-[var(--accent-primary)]">
              {formData.maxDistanceKm ?? 10} km
            </span>
          </div>
          <input
            id="max-distance-slider"
            type="range"
            min="1"
            max="30"
            step="1"
            value={formData.maxDistanceKm ?? 10}
            onChange={(e) => onChange({ maxDistanceKm: Number(e.target.value) })}
            className="tactile-slider"
          />
          <p className="text-[11px] text-[var(--ink-secondary)] mt-1.5">
            Kos yang berada di luar radius ini akan memperoleh skor jarak lebih rendah.
          </p>
        </div>
      )}

      {/* Kecamatan Preferences */}
      <div className="pt-2 border-t border-[var(--border-stone)]">
        <p className="text-xs font-semibold text-[var(--ink-primary)] mb-2.5">
          {hasLocation
            ? 'Atau pilih kecamatan preferensi (opsional):'
            : 'Pilih kecamatan yang Anda inginkan:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CITIES.map((city) => {
            const active = Boolean(formData.preferredCities?.includes(city));
            return (
              <button
                key={city}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border-[var(--border-stone)] hover:border-[var(--ink-secondary)]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
