import React from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export interface UserErrorStateProps {
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
}

export const UserErrorState: React.FC<UserErrorStateProps> = ({ error, onRetry, onBack }) => (
  <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
    <Header />
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center space-y-4">
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
        <h2 className="text-xl font-bold text-[var(--ink-primary)]">Gagal Memuat User</h2>
        <p className="text-sm text-[var(--ink-secondary)]">{error}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
          >
            Kembali ke Daftar User
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);
