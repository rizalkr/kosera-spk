'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { PreferencesForm } from '@/components/features/profile-matching';

/**
 * User Preferences Page
 *
 * Allows users to set their preferences for profile matching recommendations.
 */
export default function PreferencesPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/recommendations');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER', 'ADMIN']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] mb-2 transition-colors"
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Kembali ke Profil</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Preferensi Pencarian Kos
              </h1>
              <p className="text-sm text-[var(--ink-secondary)] mt-1">
                Atur kriteria budget, area Semarang, fasilitas, dan bobot SPK agar rekomendasi semakin akurat.
              </p>
            </div>
          </div>

          {/* Mist Sage Info Callout */}
          <div className="bg-[var(--accent-tint)] border border-[#BBDCD0] rounded-[16px] p-5 sm:p-6 flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-[10px] bg-[var(--bg-surface)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
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
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--accent-primary)]">
                Cara Kerja Profile Matching SPK
              </h2>
              <p className="text-xs sm:text-sm text-[var(--ink-primary)]/85 mt-1 leading-relaxed">
                Sistem menghitung kedekatan karakteristik setiap kos terhadap preferensi Anda pada skala{' '}
                <span className="font-mono-tabular font-semibold">1.0 - 5.0</span> lalu mengalikannya
                dengan bobot prioritas kriteria yang Anda tetapkan.
              </p>
            </div>
          </div>

          <PreferencesForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
