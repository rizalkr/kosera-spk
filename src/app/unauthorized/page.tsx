'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center space-y-6">
        <div className="mx-auto w-14 h-14 bg-[var(--accent-danger-tint)] border border-[#ECC6C0] rounded-full flex items-center justify-center text-[var(--accent-danger)]">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
            Akses Ditolak
          </h1>
          <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
            Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator apabila Anda memerlukan akses peran tersebut.
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors inline-block"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/auth/login"
            className="w-full py-2.5 px-4 rounded-[10px] text-sm font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors inline-block"
          >
            Masuk dengan Akun Lain
          </Link>
        </div>
      </div>
    </div>
  );
}
