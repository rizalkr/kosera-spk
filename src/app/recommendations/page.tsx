'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useProfileMatching, useUserPreferences } from '@/hooks/profile-matching';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MatchingResultCard } from '@/components/features/profile-matching';
import Link from 'next/link';

/**
 * Profile Matching Recommendations Page
 * 
 * Displays personalized kos recommendations based on user preferences
 * using the Profile Matching SPK algorithm.
 * 
 * Features:
 * - Auto-detect location if user hasn't set preferences
 * - Use browser geolocation as fallback for location scoring
 */
export default function RecommendationsPage() {
  const [page, setPage] = useState(1);
  const [minScore, setMinScore] = useState(0);
  const limit = 10;

  // Get user preferences and geolocation
  const { data: preferencesData, isLoading: preferencesLoading } = useUserPreferences();
  const geolocation = useGeolocation({ autoDetect: true }); // Auto-detect on mount
  
  const preferences = preferencesData?.data;
  const hasPreferences = !!preferences;
  const hasLocationPreference = !!(preferences?.preferredLatitude && preferences?.preferredLongitude);
  
  // Build query params with geolocation fallback
  const queryParams = useMemo(() => {
    const params: { page: number; limit: number; minScore: number; latitude?: number; longitude?: number } = {
      page,
      limit,
      minScore,
    };
    
    // If user has no location preference but we have geolocation, use it as fallback
    if (!hasLocationPreference && geolocation.hasLocation && geolocation.latitude && geolocation.longitude) {
      params.latitude = geolocation.latitude;
      params.longitude = geolocation.longitude;
    }
    
    return params;
  }, [page, limit, minScore, hasLocationPreference, geolocation.hasLocation, geolocation.latitude, geolocation.longitude]);

  const { data: matchingData, isLoading: matchingLoading, error } = useProfileMatching(queryParams);

  const recommendations = matchingData?.data?.recommendations ?? [];
  const pagination = matchingData?.data?.pagination;

  // Loading state
  if (preferencesLoading || matchingLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER', 'ADMIN']}>
        <div className="min-h-screen bg-gray-50 pt-20">
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER', 'ADMIN']}>
        <div className="min-h-screen bg-gray-50 pt-20">
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl p-8 shadow text-center">
              <div className="text-red-500 text-6xl mb-4">!</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Gagal Memuat Rekomendasi</h1>
              <p className="text-gray-600 mb-6">Terjadi kesalahan saat memuat rekomendasi.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER', 'ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Rekomendasi Untuk Anda
            </h1>
            <p className="text-gray-600">
              Kos yang cocok berdasarkan preferensi Anda menggunakan metode Profile Matching
            </p>
          </div>

          {/* Preferences Status */}
          {!hasPreferences ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="text-yellow-500 text-2xl">!</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Preferensi Belum Diatur
                  </h3>
                  <p className="text-yellow-700 text-sm mb-2">
                    Atur preferensi Anda untuk mendapatkan rekomendasi yang lebih akurat.
                  </p>
                  {/* Geolocation Status */}
                  {geolocation.hasLocation ? (
                    <p className="text-green-700 text-sm mb-4">
                      Lokasi terdeteksi ({geolocation.latitude?.toFixed(4)}, {geolocation.longitude?.toFixed(4)}) - 
                      menggunakan lokasi Anda untuk menghitung jarak.
                    </p>
                  ) : geolocation.loading ? (
                    <p className="text-blue-700 text-sm mb-4">
                      Mendeteksi lokasi Anda...
                    </p>
                  ) : (
                    <p className="text-yellow-700 text-sm mb-4">
                      {geolocation.error?.message || 'Lokasi tidak tersedia. Skor lokasi menggunakan nilai netral.'}
                    </p>
                  )}
                  <Link
                    href="/profile/preferences"
                    className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Atur Preferensi
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">
                    Preferensi Aktif
                  </h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    {preferences.budgetMin || preferences.budgetMax ? (
                      <p>
                        Budget: Rp {(preferences.budgetMin ?? 0).toLocaleString('id-ID')} - 
                        Rp {(preferences.budgetMax ?? 0).toLocaleString('id-ID')}
                      </p>
                    ) : null}
                    {preferences.preferredCities.length > 0 && (
                      <p>Kota: {preferences.preferredCities.join(', ')}</p>
                    )}
                    {preferences.requiredFacilities.length > 0 && (
                      <p>Fasilitas Wajib: {preferences.requiredFacilities.slice(0, 3).join(', ')}
                        {preferences.requiredFacilities.length > 3 && ` +${preferences.requiredFacilities.length - 3} lainnya`}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href="/profile/preferences"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit Preferensi
                </Link>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Skor Minimum:
              </label>
              <select
                value={minScore}
                onChange={(e) => {
                  setMinScore(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 text-gray-500 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Semua</option>
                <option value={2}>2.0+ (Kurang Cocok)</option>
                <option value={3}>3.0+ (Cukup Cocok)</option>
                <option value={4}>4.0+ (Cocok)</option>
                <option value={4.5}>4.5+ (Sangat Cocok)</option>
              </select>
              <span className="text-sm text-gray-500">
                {pagination?.total ?? 0} kos ditemukan
              </span>
            </div>
          </div>

          {/* Results */}
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow text-center">
              <div className="text-gray-400 text-6xl mb-4">?</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak Ada Rekomendasi
              </h3>
              <p className="text-gray-500 mb-4">
                {minScore > 0
                  ? `Tidak ada kos dengan skor kecocokan di atas ${minScore}. Coba turunkan filter skor minimum.`
                  : 'Tidak ada kos yang tersedia saat ini.'}
              </p>
              {minScore > 0 && (
                <button
                  onClick={() => setMinScore(0)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((kos, index) => (
                <div key={kos.id} className="relative">
                  {/* Rank Badge */}
                  <div className="absolute -left-2 -top-2 z-10 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                    {(page - 1) * limit + index + 1}
                  </div>
                  <MatchingResultCard kos={kos} showDetails={true} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-4 text-gray-600 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              <span className="px-4  py-2 text-gray-600">
                Halaman {pagination.page} dari {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="px-4 text-gray-600 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          )}

          {/* Algorithm Info */}
          <div className="mt-12 bg-gray-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Tentang Sistem Rekomendasi
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sistem ini menggunakan metode <strong>Profile Matching</strong> untuk mencocokkan 
              preferensi Anda dengan karakteristik kos yang tersedia. Skor kecocokan dihitung 
              berdasarkan 4 kriteria:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {hasPreferences ? preferences.weightPrice : 30}%
                </div>
                <div className="text-sm text-gray-600">Harga</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {hasPreferences ? preferences.weightLocation : 25}%
                </div>
                <div className="text-sm text-gray-600">Lokasi</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500 mb-1">
                  {hasPreferences ? preferences.weightFacilities : 25}%
                </div>
                <div className="text-sm text-gray-600">Fasilitas</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-500 mb-1">
                  {hasPreferences ? preferences.weightRating : 20}%
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
