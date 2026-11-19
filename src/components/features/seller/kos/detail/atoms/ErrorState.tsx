import React from 'react';

export interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  onBack: () => void;
}

export const SellerKosDetailError: React.FC<ErrorStateProps> = ({ message, onRetry, onBack }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8">
    <div className="text-center py-10 space-y-4">
      <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-[var(--ink-primary)]">Gagal Memuat Detail Kos</h3>
      <p className="text-sm text-[var(--ink-secondary)]">
        {message || 'Terjadi kesalahan saat mengambil detail kos.'}
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
        >
          Coba Lagi
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
        >
          Kembali ke Daftar Kos
        </button>
      </div>
    </div>
  </div>
);
