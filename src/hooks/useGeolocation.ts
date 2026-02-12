'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Geolocation state interface
 */
export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: GeolocationError | null;
  loading: boolean;
  timestamp: number | null;
}

/**
 * Geolocation error types
 */
export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Geolocation options
 */
interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoDetect?: boolean;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000, // Cache for 1 minute
  autoDetect: false,
};

/**
 * Custom hook for browser geolocation
 * 
 * Features:
 * - Auto-detect location on mount (optional)
 * - Manual trigger with requestLocation()
 * - Permission state handling
 * - Error handling with user-friendly messages
 * - Caching with localStorage
 * 
 * @param options - Geolocation options
 * @returns Geolocation state and methods
 */
export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const opts = { ...defaultOptions, ...options };
  
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
    timestamp: null,
  });

  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

  /**
   * Get cached location from localStorage
   */
  const getCachedLocation = useCallback((): GeolocationState | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem('user_geolocation');
      if (!cached) return null;
      
      const parsed = JSON.parse(cached) as GeolocationState;
      
      // Check if cache is still valid (within maximumAge)
      if (parsed.timestamp && Date.now() - parsed.timestamp < (opts.maximumAge || 60000)) {
        return parsed;
      }
      
      return null;
    } catch {
      return null;
    }
  }, [opts.maximumAge]);

  /**
   * Save location to localStorage
   */
  const cacheLocation = useCallback((location: GeolocationState) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('user_geolocation', JSON.stringify(location));
    } catch {
      // Ignore storage errors
    }
  }, []);

  /**
   * Clear cached location
   */
  const clearCache = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('user_geolocation');
    } catch {
      // Ignore storage errors
    }
  }, []);

  /**
   * Convert GeolocationPositionError to user-friendly message
   */
  const getErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser.';
      case error.POSITION_UNAVAILABLE:
        return 'Lokasi tidak tersedia. Pastikan GPS aktif.';
      case error.TIMEOUT:
        return 'Waktu habis saat mencari lokasi. Coba lagi.';
      default:
        return 'Gagal mendapatkan lokasi.';
    }
  };

  /**
   * Request current location
   */
  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: { code: 0, message: 'Geolocation tidak didukung browser ini.' },
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newState: GeolocationState = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
          timestamp: Date.now(),
        };
        
        setState(newState);
        cacheLocation(newState);
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: { code: error.code, message: getErrorMessage(error) },
          loading: false,
        }));
      },
      {
        enableHighAccuracy: opts.enableHighAccuracy,
        timeout: opts.timeout,
        maximumAge: opts.maximumAge,
      }
    );
  }, [opts.enableHighAccuracy, opts.timeout, opts.maximumAge, cacheLocation]);

  /**
   * Check permission state
   */
  const checkPermission = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return null;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionState(result.state);
      
      // Listen for permission changes
      result.addEventListener('change', () => {
        setPermissionState(result.state);
      });
      
      return result.state;
    } catch {
      return null;
    }
  }, []);

  /**
   * Initialize: check cache and permission
   */
  useEffect(() => {
    // Try to use cached location first
    const cached = getCachedLocation();
    if (cached) {
      setState(cached);
    }

    // Check permission state
    checkPermission();

    // Auto-detect if enabled and no cache
    if (opts.autoDetect && !cached) {
      requestLocation();
    }
  }, [getCachedLocation, checkPermission, opts.autoDetect, requestLocation]);

  /**
   * Check if geolocation is supported
   */
  const isSupported = typeof navigator !== 'undefined' && !!navigator.geolocation;

  /**
   * Check if we have a valid location
   */
  const hasLocation = state.latitude !== null && state.longitude !== null;

  return {
    ...state,
    isSupported,
    hasLocation,
    permissionState,
    requestLocation,
    clearCache,
    checkPermission,
  };
};

export default useGeolocation;
