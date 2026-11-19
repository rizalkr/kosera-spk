'use client';

import { useSellerDashboard } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { KosCard, EmptyState } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { formatCurrency } from '@/utils/format';
import { OverviewStatsPanel } from '@/components/organisms/SellerDashboard/OverviewStatsPanel';
import { PerformanceSummaryPanel } from '@/components/organisms/SellerDashboard/PerformanceSummaryPanel';
import { RecentActivityPanel } from '@/components/organisms/SellerDashboard/RecentActivityPanel';
import { TipsInsightsPanel } from '@/components/organisms/SellerDashboard/TipsInsightsPanel';
import { QuickActionsPanel } from '@/components/organisms/SellerDashboard/QuickActionsPanel';
import type { SellerDashboardKosItem } from '@/types/dashboard';

function SellerDashboard() {
  const { data, isLoading, error, refetch } = useSellerDashboard();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] p-6">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-[var(--bg-muted)] rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--bg-surface)] border border-[var(--border-stone)] p-5 rounded-[16px] space-y-3"
              >
                <div className="h-3.5 bg-[var(--bg-muted)] rounded w-24" />
                <div className="h-7 bg-[var(--bg-muted)] rounded w-32" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--bg-surface)] border border-[var(--border-stone)] p-6 rounded-[16px] h-52"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--accent-danger-tint)] border border-[#ECC6C0] rounded-[16px] p-6 text-center space-y-2">
            <h2 className="text-lg font-bold text-[var(--accent-danger)]">
              Gagal Memuat Dashboard
            </h2>
            <p className="text-sm text-[var(--ink-secondary)]">
              Gagal memuat data dashboard seller. Silakan coba lagi nanti.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.success || !data.data) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--accent-spark-tint)] border border-[#F2CDBB] rounded-[16px] p-6 text-center space-y-2">
            <h2 className="text-lg font-bold text-[#9A471F]">Data Tidak Tersedia</h2>
            <p className="text-sm text-[var(--ink-secondary)]">
              Data dashboard tidak ditemukan. Silakan periksa kembali nanti.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { kos, stats } = data.data;

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--accent-tint)] border border-[#BBDCD0] text-[11px] font-semibold text-[var(--accent-primary)] mb-2">
              Workspace Pemilik Kos
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
              Dashboard Seller
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Kelola properti kos, pantau tingkat hunian, dan tindak lanjuti pengajuan booking.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
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
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/seller/kos')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
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
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Kelola Kos</span>
            </button>
          </div>
        </div>

        <OverviewStatsPanel stats={stats} />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--ink-primary)]">Properti Anda</h2>
          {kos.length === 0 ? (
            <EmptyState
              title="Belum Ada Properti"
              description="Mulai dengan menambahkan properti kos pertama Anda untuk mengelola kamar dan menerima pengajuan booking."
              icon={
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
              actions={
                <Button onClick={() => router.push('/seller/kos/new')} variant="primary" size="md">
                  Tambah Kos Pertama
                </Button>
              }
              variant="onboarding"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {kos.map((kosData: SellerDashboardKosItem) => (
                <KosCard key={kosData.id} kosData={kosData} formatCurrency={formatCurrency} />
              ))}
            </div>
          )}
        </section>

        <PerformanceSummaryPanel stats={stats} kosCount={kos.length} />

        <RecentActivityPanel kos={kos} />

        <TipsInsightsPanel stats={stats} kosCount={kos.length} />

        <QuickActionsPanel hasKos={kos.length > 0} />
      </div>
    </div>
  );
}

export default SellerDashboard;
