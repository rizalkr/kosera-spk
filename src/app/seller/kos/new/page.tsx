'use client';

import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { KosFormShell } from '@/components/kos/create/KosFormShell';
import { useRouter } from 'next/navigation';

export default function NewKosPage() {
  const router = useRouter();
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] mb-3 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
              Tambah Kos Baru
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Lengkapi informasi kos Anda agar mudah ditemukan dan dicocokkan oleh sistem SPK Kosera.
            </p>
          </div>
          <KosFormShell />
        </div>
      </div>
    </ProtectedRoute>
  );
}
