'use client';

import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { UnifiedKosCard } from '@/components/molecules/UnifiedKosCard';
import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import { useFavorites } from '@/hooks/useApi';
import type { FavoriteKos } from '@/types/favorites';

export default function FavoritesPage() {
  const { user } = useAuthGuard();
  const { data: favoritesData, isLoading, error, refetch } = useFavorites();

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
              <div className="animate-pulse space-y-2">
                <div className="h-7 bg-[var(--bg-muted)] rounded w-48" />
                <div className="h-4 bg-[var(--bg-muted)] rounded w-72" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[16px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] overflow-hidden"
                  >
                    <div className="aspect-[16/10] bg-[var(--bg-muted)]" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4" />
                      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2" />
                      <div className="h-6 bg-[var(--bg-muted)] rounded w-2/5" />
                    </div>
                  </div>
                ))}
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
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 sm:p-10 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--ink-primary)]">
                Gagal Memuat Favorit
              </h1>
              <p className="text-sm text-[var(--ink-secondary)]">
                Terjadi kesalahan saat memuat daftar kos favorit Anda.
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

  const favorites = favoritesData?.data?.favorites || [];

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                  Favorit Saya
                </h1>
                <p className="text-sm text-[var(--ink-secondary)] mt-1">
                  Halo <span className="font-semibold text-[var(--ink-primary)]">{user?.username}</span>, simpan dan bandingkan kandidat kos pilihan Anda di sini.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-muted)] border border-[var(--border-stone)] text-xs font-semibold text-[var(--ink-primary)] self-start sm:self-auto">
                <span className="font-mono-tabular text-[var(--accent-primary)]">
                  {favorites.length}
                </span>
                <span>kos tersimpan</span>
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="h-14 w-14 mx-auto rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[var(--ink-primary)]">
                    Belum ada kos favorit
                  </h2>
                  <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto">
                    Tambahkan kos ke favorit saat menjelajah agar mudah ditinjau kembali atau dibandingkan.
                  </p>
                </div>
                <Link
                  href="/list"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                  <span>Jelajahi Kos</span>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favorites.map((favorite: FavoriteKos) => {
                    const totalRooms = favorite.kos.totalRooms ?? 0;
                    const occupiedRooms = favorite.kos.occupiedRooms ?? 0;
                    const availableRooms =
                      totalRooms > 0 ? Math.max(0, totalRooms - occupiedRooms) : undefined;
                    const facilities = (favorite.kos.facilities || '')
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean);

                    return (
                      <UnifiedKosCard
                        key={favorite.id}
                        id={favorite.kos.id}
                        name={favorite.kos.name}
                        description={favorite.kos.description}
                        price={favorite.post.price}
                        address={favorite.kos.address}
                        city={favorite.kos.city}
                        rating={favorite.post.averageRating}
                        reviewCount={favorite.post.reviewCount}
                        facilities={facilities}
                        availableRooms={availableRooms}
                        totalRooms={totalRooms > 0 ? totalRooms : undefined}
                        isFavorite={true}
                        showCompareButton={true}
                        onFavoriteChange={(_kosId, nextFavorited) => {
                          if (!nextFavorited) {
                            refetch();
                          }
                        }}
                      />
                    );
                  })}
                </div>

                <div className="pt-5 border-t border-[var(--border-stone)] flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Menampilkan <span className="font-mono-tabular font-semibold">{favorites.length}</span> kos tersimpan
                  </p>
                  <Link
                    href="/list"
                    className="text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors"
                  >
                    Jelajahi kos lainnya
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
