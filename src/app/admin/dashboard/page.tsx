'use client';

import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { VisualizationPanel } from '@/components/features/dashboard/VisualizationPanel';
import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import { StatCard } from '@/components/features/dashboard/admin/atoms/StatCard';
import { RecentActivitiesPanel } from '@/components/features/dashboard/admin/organisms/RecentActivitiesPanel';
import { PlatformOverviewPanel } from '@/components/features/dashboard/admin/organisms/PlatformOverviewPanel';
import { QuickActionsPanel } from '@/components/features/dashboard/admin/organisms/QuickActionsPanel';

export default function AdminDashboard() {
  const { user } = useAuthGuard();
  const { stats, recentActivities, loading, error, refreshData, analytics } = useAdminDashboard();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_register':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'kos_added':
      case 'kos_updated':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'booking_made':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      case 'payment_received':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-8 py-6 flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] animate-spin" />
              <p className="text-sm font-medium text-[var(--ink-secondary)]">
                Memuat data dashboard...
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--accent-danger)]">{error}</p>
              <button
                type="button"
                onClick={refreshData}
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
    <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--ink-primary)] text-white text-[11px] font-semibold mb-2">
                Admin Console
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Admin Dashboard
              </h1>
              <p className="text-sm text-[var(--ink-secondary)] mt-1">
                Selamat datang,{' '}
                <span className="font-semibold text-[var(--ink-primary)]">{user?.username}</span>.
                Pantau kesehatan platform, listing kos, dan transaksi sewa.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              <span>{loading ? 'Memuat...' : 'Refresh Data'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Total Users"
              value={stats?.totalUsers}
              colorClass="text-[var(--ink-primary)]"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
            <StatCard
              label="Active Users"
              value={stats?.activeUsers}
              colorClass="text-[var(--accent-primary)]"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
            />
            <StatCard
              label="Total Kos"
              value={stats?.totalKos}
              colorClass="text-[var(--ink-primary)]"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
            />
            <StatCard
              label="Total Bookings"
              value={stats?.totalBookings}
              colorClass="text-[var(--accent-spark)]"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivitiesPanel activities={recentActivities} getIcon={getActivityIcon} />
            <PlatformOverviewPanel
              totalViews={analytics?.overview?.totalViews}
              averageRating={stats?.averageRating ? Number(stats.averageRating) : undefined}
            />
          </div>

          <VisualizationPanel />

          <QuickActionsPanel />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
