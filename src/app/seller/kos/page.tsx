'use client';

import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useSellerKosListView } from '@/hooks/seller/kos/useSellerKosListView';
import { StatsRow } from '@/components/features/seller/kos/list/organisms/StatsRow';
import { KosGrid } from '@/components/features/seller/kos/list/organisms/KosGrid';
import { KosTips } from '@/components/features/seller/kos/list/organisms/KosTips';
import { SellerKosListLoading } from '@/components/features/seller/kos/list/atoms/LoadingState';
import { SellerKosListError } from '@/components/features/seller/kos/list/atoms/ErrorState';

function SellerKosPage() {
  const {
    user,
    kosList,
    isLoading,
    error,
    refetch,
    isRefreshing,
    handleRefresh,
    counts,
    formatPrice,
    getKosStatus,
  } = useSellerKosListView();

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SellerKosListLoading />
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SellerKosListError onRetry={refetch} />
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-5 border-b border-[var(--border-stone)] gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                  Daftar Kos Saya
                </h1>
                <p className="text-sm text-[var(--ink-secondary)] mt-1">
                  Kelola seluruh properti kos Anda ·{' '}
                  <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                    {counts.totalKos}
                  </span>{' '}
                  kos terdaftar
                </p>
                {user?.username && (
                  <p className="mt-1 text-xs text-[var(--ink-secondary)]">
                    Masuk sebagai{' '}
                    <span className="font-semibold text-[var(--accent-primary)]">
                      {user.username}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  <span>{isRefreshing ? 'Memuat...' : 'Refresh'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = '/seller/kos/new')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Tambah Kos Baru</span>
                </button>
              </div>
            </div>

            {counts.totalKos > 0 && (
              <StatsRow counts={counts} formatTotalPrice={() => formatPrice(counts.totalPrice)} />
            )}

            {counts.totalKos === 0 ? (
              <div className="text-center py-14 px-4 space-y-4">
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
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[var(--ink-primary)]">
                    Belum Ada Kos Terdaftar
                  </h3>
                  <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto">
                    Mulai daftarkan properti kos pertama Anda untuk mengelola kamar dan menerima pengajuan booking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => (window.location.href = '/seller/kos/new')}
                  className="inline-flex items-center px-6 py-3 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                  Tambah Kos Pertama
                </button>
              </div>
            ) : (
              <KosGrid kosList={kosList} formatPrice={formatPrice} getKosStatus={getKosStatus} />
            )}

            {counts.totalKos > 0 && <KosTips />}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default SellerKosPage;
