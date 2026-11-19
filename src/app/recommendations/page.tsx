'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import {
  useCreatePreferences,
  useProfileMatching,
  useUpdatePreferences,
  useUserPreferences,
} from '@/hooks/profile-matching';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MatchingResultCard } from '@/components/features/profile-matching';
import MapSection from '@/components/features/maps/MapSection';
import type { MapKosMarkerItem } from '@/components/features/maps/RealMap';
import { Pagination } from '@/components/ui/Pagination';
import {
  computeLiveSpkScore,
  DEFAULT_SPK_WEIGHTS,
  formatRupiah,
  normalizeWeightsTo100,
  type SpkWeightValues,
} from '@/lib/utils/discovery';

const MIN_SCORE_PILLS = [
  { label: 'Semua', value: 0 },
  { label: '>= 60%', value: 3 },
  { label: '>= 75%', value: 3.75 },
  { label: '>= 85%', value: 4.25 },
] as const;

export default function RecommendationsPage() {
  const [page, setPage] = useState(1);
  const [minScore, setMinScore] = useState(0);
  const [hoveredKosId, setHoveredKosId] = useState<number | null>(null);
  const [liveWeights, setLiveWeights] =
    useState<SpkWeightValues>(DEFAULT_SPK_WEIGHTS);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const weightsSyncedRef = useRef(false);
  const limit = 10;

  const { data: preferencesData, isLoading: preferencesLoading } =
    useUserPreferences();
  const updatePreferencesMutation = useUpdatePreferences();
  const createPreferencesMutation = useCreatePreferences();
  const geolocation = useGeolocation({ autoDetect: true });

  const preferences = preferencesData?.data;
  const hasPreferences = Boolean(preferences);
  const hasLocationPreference = Boolean(
    preferences?.preferredLatitude && preferences?.preferredLongitude
  );

  useEffect(() => {
    if (preferences && !weightsSyncedRef.current) {
      weightsSyncedRef.current = true;
      setLiveWeights({
        price: preferences.weightPrice ?? DEFAULT_SPK_WEIGHTS.price,
        location: preferences.weightLocation ?? DEFAULT_SPK_WEIGHTS.location,
        facilities:
          preferences.weightFacilities ?? DEFAULT_SPK_WEIGHTS.facilities,
        rating: preferences.weightRating ?? DEFAULT_SPK_WEIGHTS.rating,
      });
    }
  }, [preferences]);

  const queryParams = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      minScore: number;
      latitude?: number;
      longitude?: number;
    } = {
      page,
      limit,
      minScore,
    };

    if (
      !hasLocationPreference &&
      geolocation.hasLocation &&
      geolocation.latitude &&
      geolocation.longitude
    ) {
      params.latitude = geolocation.latitude;
      params.longitude = geolocation.longitude;
    }

    return params;
  }, [
    page,
    limit,
    minScore,
    hasLocationPreference,
    geolocation.hasLocation,
    geolocation.latitude,
    geolocation.longitude,
  ]);

  const {
    data: matchingData,
    isLoading: matchingLoading,
    error,
    refetch,
  } = useProfileMatching(queryParams);

  const recommendations = useMemo(
    () => matchingData?.data?.recommendations ?? [],
    [matchingData]
  );
  const pagination = matchingData?.data?.pagination;

  const normalizedWeights = useMemo(
    () => normalizeWeightsTo100(liveWeights),
    [liveWeights]
  );

  const rankedRecommendations = useMemo(() => {
    return recommendations
      .map((kos) => ({
        ...kos,
        matchingScore: computeLiveSpkScore(kos.matchingDetails, liveWeights),
      }))
      .sort((a, b) => b.matchingScore - a.matchingScore);
  }, [recommendations, liveWeights]);

  const mapItems: MapKosMarkerItem[] = useMemo(
    () =>
      rankedRecommendations.map((kos) => ({
        id: kos.id,
        name: kos.name,
        price: kos.price,
        address: kos.address,
        city: kos.city,
        latitude: kos.latitude,
        longitude: kos.longitude,
        averageRating: kos.averageRating,
        reviewCount: kos.reviewCount,
        matchingScore: kos.matchingScore,
      })),
    [rankedRecommendations]
  );

  const handleSaveWeights = async () => {
    setSaveMessage(null);
    try {
      if (preferences) {
        await updatePreferencesMutation.mutateAsync({
          weightPrice: normalizedWeights.price,
          weightLocation: normalizedWeights.location,
          weightFacilities: normalizedWeights.facilities,
          weightRating: normalizedWeights.rating,
        });
      } else {
        await createPreferencesMutation.mutateAsync({
          roomType: 'any',
          minRating: 3.0,
          needsAvailableRoom: true,
          weightPrice: normalizedWeights.price,
          weightLocation: normalizedWeights.location,
          weightFacilities: normalizedWeights.facilities,
          weightRating: normalizedWeights.rating,
        });
      }
      setSaveMessage('Bobot prioritas SPK berhasil disimpan.');
      window.setTimeout(() => setSaveMessage(null), 3500);
    } catch {
      setSaveMessage('Gagal menyimpan bobot prioritas.');
    }
  };

  const handleResetWeights = () => {
    setSaveMessage(null);
    if (preferences) {
      setLiveWeights({
        price: preferences.weightPrice ?? DEFAULT_SPK_WEIGHTS.price,
        location: preferences.weightLocation ?? DEFAULT_SPK_WEIGHTS.location,
        facilities:
          preferences.weightFacilities ?? DEFAULT_SPK_WEIGHTS.facilities,
        rating: preferences.weightRating ?? DEFAULT_SPK_WEIGHTS.rating,
      });
    } else {
      setLiveWeights(DEFAULT_SPK_WEIGHTS);
    }
  };

  const isSavingWeights =
    updatePreferencesMutation.isPending || createPreferencesMutation.isPending;

  if (preferencesLoading || matchingLoading) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={['RENTER', 'SELLER', 'ADMIN']}
      >
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="animate-pulse space-y-5">
              <div className="h-9 bg-[var(--bg-muted)] rounded-[10px] w-72" />
              <div className="h-4 bg-[var(--bg-muted)] rounded w-96 max-w-full" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 h-48"
                    />
                  ))}
                </div>
                <div className="lg:col-span-4 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] h-96" />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute
        requireAuth={true}
        allowedRoles={['RENTER', 'SELLER', 'ADMIN']}
      >
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center space-y-4">
              <svg
                className="w-10 h-10 mx-auto text-[var(--accent-danger)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h1 className="text-2xl font-bold text-[var(--ink-primary)]">
                Gagal Memuat Rekomendasi
              </h1>
              <p className="text-sm text-[var(--ink-secondary)]">
                Terjadi kesalahan saat menghitung skor kecocokan SPK.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
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
    <ProtectedRoute
      requireAuth={true}
      allowedRoles={['RENTER', 'SELLER', 'ADMIN']}
    >
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--ink-primary)] pt-16 flex flex-col">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-28 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[var(--ink-primary)]">
                Rekomendasi SPK Untukmu
              </h1>
              <p className="text-sm sm:text-base text-[var(--ink-secondary)] max-w-2xl">
                Peringkat kos dihitung menggunakan metode Profile Matching
                berdasarkan preferensi harga, jarak lokasi, fasilitas, dan
                ulasan penghuni.
              </p>
            </div>
            <Link
              href="/profile/preferences"
              className="px-4 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors self-start sm:self-auto shrink-0"
            >
              Edit Preferensi Lengkap
            </Link>
          </div>

          {/* Preference & Geolocation Banner */}
          {!hasPreferences ? (
            <div className="bg-[var(--accent-spark-tint)] border border-[var(--accent-spark)]/30 rounded-[16px] p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-spark)] text-white flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-[var(--ink-primary)]">
                      Preferensi Lengkap Belum Diatur
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                      Saat ini sistem memakai bobot standar serta lokasi Anda.{' '}
                      {geolocation.hasLocation ? (
                        <span className="font-mono-tabular font-medium text-[var(--accent-primary)]">
                          Lokasi terdeteksi ({geolocation.latitude?.toFixed(3)},{' '}
                          {geolocation.longitude?.toFixed(3)}).
                        </span>
                      ) : geolocation.loading ? (
                        'Mendeteksi lokasi perangkat...'
                      ) : (
                        geolocation.error?.message ||
                        'Lokasi tidak tersedia, skor jarak memakai nilai netral.'
                      )}
                    </p>
                  </div>
                </div>
                <Link
                  href="/profile/preferences"
                  className="px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-spark)] text-white hover:opacity-95 transition-opacity shrink-0 text-center"
                >
                  Atur Preferensi
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                    Preferensi Aktif
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[var(--ink-secondary)]">
                  {(preferences?.budgetMin || preferences?.budgetMax) && (
                    <span className="font-mono-tabular text-[var(--ink-primary)] font-medium">
                      Budget: {formatRupiah(preferences.budgetMin ?? 0)} –{' '}
                      {formatRupiah(preferences.budgetMax ?? 0)}
                    </span>
                  )}
                  {preferences && preferences.preferredCities.length > 0 && (
                    <span>
                      Area: {preferences.preferredCities.join(', ')}
                    </span>
                  )}
                  {preferences && preferences.requiredFacilities.length > 0 && (
                    <span>
                      Wajib:{' '}
                      {preferences.requiredFacilities.slice(0, 3).join(', ')}
                      {preferences.requiredFacilities.length > 3 &&
                        ` +${preferences.requiredFacilities.length - 3}`}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/profile/preferences"
                className="text-xs font-semibold text-[var(--accent-primary)] hover:underline shrink-0"
              >
                Ubah detail preferensi
              </Link>
            </div>
          )}

          {/* On-Page Live SPK Priority Weight Tuner */}
          <section
            aria-label="Pengatur bobot SPK"
            className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[var(--ink-primary)]">
                  Sesuaikan Prioritas Bobot SPK
                </h2>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                  Geser slider untuk mengurutkan ulang skor kecocokan kos secara
                  langsung.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetWeights}
                  className="px-3 py-1.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
                >
                  Reset Bobot
                </button>
                <button
                  type="button"
                  onClick={handleSaveWeights}
                  disabled={isSavingWeights}
                  className="px-3.5 py-1.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSavingWeights ? 'Menyimpan...' : 'Simpan Bobot'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {(
                [
                  {
                    key: 'price',
                    label: 'Harga',
                    pct: normalizedWeights.price,
                  },
                  {
                    key: 'location',
                    label: 'Lokasi',
                    pct: normalizedWeights.location,
                  },
                  {
                    key: 'facilities',
                    label: 'Fasilitas',
                    pct: normalizedWeights.facilities,
                  },
                  {
                    key: 'rating',
                    label: 'Rating',
                    pct: normalizedWeights.rating,
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3.5"
                >
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <label
                      htmlFor={`rec-weight-${item.key}`}
                      className="font-semibold text-[var(--ink-primary)]"
                    >
                      {item.label}
                    </label>
                    <span className="font-mono-tabular font-bold text-[var(--accent-primary)]">
                      {item.pct}%
                    </span>
                  </div>
                  <input
                    id={`rec-weight-${item.key}`}
                    type="range"
                    min={5}
                    max={80}
                    step={5}
                    value={liveWeights[item.key]}
                    onChange={(e) =>
                      setLiveWeights((prev) => ({
                        ...prev,
                        [item.key]: Number(e.target.value),
                      }))
                    }
                    className="tactile-slider"
                  />
                </div>
              ))}
            </div>

            {saveMessage && (
              <p
                role="status"
                className="text-xs font-medium text-[var(--accent-primary)]"
              >
                {saveMessage}
              </p>
            )}
          </section>

          {/* Minimum Score Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--ink-secondary)] mr-1">
                Minimal kecocokan:
              </span>
              {MIN_SCORE_PILLS.map((pill) => {
                const active = minScore === pill.value;
                return (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => {
                      setMinScore(pill.value);
                      setPage(1);
                    }}
                    className={`font-mono-tabular px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--ink-primary)] border-[var(--ink-primary)] text-white'
                        : 'bg-[var(--bg-surface)] border-[var(--border-stone)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
            <span className="font-mono-tabular text-xs font-medium text-[var(--ink-secondary)]">
              {pagination?.total ?? rankedRecommendations.length} kos cocok
            </span>
          </div>

          {/* Results + Synchronized Map */}
          {rankedRecommendations.length === 0 ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-12 text-center space-y-3">
              <h3 className="text-lg font-bold text-[var(--ink-primary)]">
                Belum ada rekomendasi di batas skor ini
              </h3>
              <p className="text-sm text-[var(--ink-secondary)]">
                {minScore > 0
                  ? 'Coba pilih filter kecocokan yang lebih longgar untuk melihat kandidat lain.'
                  : 'Tidak ada kos tersedia saat ini.'}
              </p>
              {minScore > 0 && (
                <button
                  type="button"
                  onClick={() => setMinScore(0)}
                  className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                  Tampilkan Semua Skor
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-5">
                {rankedRecommendations.map((kos, index) => (
                  <MatchingResultCard
                    key={kos.id}
                    kos={kos}
                    showDetails={true}
                    rank={(page - 1) * limit + index + 1}
                    isHighlighted={hoveredKosId === kos.id}
                    onHoverChange={setHoveredKosId}
                  />
                ))}

                {pagination && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(nextPage) => setPage(nextPage)}
                  />
                )}
              </div>

              <div className="lg:col-span-4 lg:sticky lg:top-20">
                <MapSection
                  kosItems={mapItems}
                  activeKosId={hoveredKosId}
                  topKosId={rankedRecommendations[0]?.id ?? null}
                  onHoverKos={setHoveredKosId}
                  heightClassName="h-[380px]"
                />
              </div>
            </div>
          )}

          {/* Calm SPK Methodology Overview */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[var(--ink-primary)]">
                Tentang Perhitungan Profile Matching
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-secondary)] max-w-3xl">
                Skor total menggabungkan gap kriteria inti dan sekunder menjadi
                persentase kecocokan yang mudah dibandingkan di tiap kartu
                maupun dok perbandingan.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {[
                { label: 'Harga', val: normalizedWeights.price },
                { label: 'Lokasi', val: normalizedWeights.location },
                { label: 'Fasilitas', val: normalizedWeights.facilities },
                { label: 'Rating', val: normalizedWeights.rating },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-4"
                >
                  <div className="font-mono-tabular text-2xl font-bold text-[var(--accent-primary)]">
                    {item.val}%
                  </div>
                  <div className="text-xs font-medium text-[var(--ink-secondary)] mt-1">
                    Bobot {item.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
