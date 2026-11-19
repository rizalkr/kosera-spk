'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'SELLER')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center px-4">
        <div
          role="status"
          aria-live="polite"
          className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-8 py-6 flex flex-col items-center gap-3"
        >
          <div className="h-8 w-8 rounded-full border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] animate-spin" />
          <p className="text-sm font-medium text-[var(--ink-secondary)]">Memuat sesi pemilik...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center space-y-5">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[var(--ink-primary)]">Akses Ditolak</h1>
            <p className="text-sm text-[var(--ink-secondary)]">
              Anda harus masuk dengan akun pemilik kos untuk mengakses halaman ini.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="w-full py-2.5 px-5 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            Ke Halaman Masuk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
