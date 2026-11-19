import React from 'react';

export const SellerKosListError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8">
    <div className="text-center py-10 space-y-4">
      <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-[var(--ink-primary)]">Gagal Memuat Data Kos</h3>
      <p className="text-sm text-[var(--ink-secondary)]">
        Terjadi kesalahan saat mengambil data kos Anda. Silakan coba lagi.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>
  </div>
);
