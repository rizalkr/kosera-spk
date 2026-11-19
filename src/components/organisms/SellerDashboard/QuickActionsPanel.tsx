'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export interface QuickActionsPanelProps {
  hasKos: boolean;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ hasKos }) => {
  const router = useRouter();
  if (!hasKos) return null;

  return (
    <section className="bg-[var(--bg-surface)] rounded-[16px] border border-[var(--border-stone)] p-6">
      <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <button
          type="button"
          onClick={() => router.push('/seller/kos')}
          className="flex items-center justify-center gap-2.5 bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] text-[var(--ink-primary)] hover:text-[var(--accent-primary)] border border-[var(--border-stone)] p-4 rounded-[12px] text-sm font-semibold transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Kelola Daftar Kos</span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/seller/kos/new')}
          className="flex items-center justify-center gap-2.5 bg-[var(--accent-tint)] hover:bg-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-white border border-[#BBDCD0] p-4 rounded-[12px] text-sm font-semibold transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah Kos Baru</span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/seller/bookings')}
          className="flex items-center justify-center gap-2.5 bg-[var(--bg-canvas)] hover:border-[var(--accent-primary)] text-[var(--ink-primary)] hover:text-[var(--accent-primary)] border border-[var(--border-stone)] p-4 rounded-[12px] text-sm font-semibold transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Kelola Booking</span>
        </button>
      </div>
    </section>
  );
};
