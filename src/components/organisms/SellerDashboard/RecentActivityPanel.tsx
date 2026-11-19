'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/format';

interface RecentActivityKosItem {
  id: number;
  name: string;
  viewCount: number;
}

export interface RecentActivityPanelProps {
  kos: RecentActivityKosItem[];
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ kos }) => {
  const router = useRouter();
  if (kos.length === 0) return null;

  return (
    <section className="bg-[var(--bg-surface)] rounded-[16px] border border-[var(--border-stone)] p-6">
      <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">Aktivitas Properti</h3>
      <div className="space-y-3">
        {kos.slice(0, 3).map((k) => (
          <div
            key={`activity-${k.id}`}
            className="flex items-center justify-between gap-4 p-3.5 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-[var(--accent-tint)] text-[var(--accent-primary)] rounded-[10px] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--ink-primary)] truncate">{k.name}</p>
                <p className="font-mono-tabular text-xs text-[var(--ink-secondary)]">
                  {k.viewCount.toLocaleString('id-ID')} kali dilihat
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono-tabular text-sm font-bold text-[var(--accent-primary)]">
                {formatCurrency(0)}
              </p>
              <p className="text-[11px] text-[var(--ink-secondary)]">Pendapatan</p>
            </div>
          </div>
        ))}
        {kos.length > 3 && (
          <button
            type="button"
            onClick={() => router.push('/seller/kos')}
            className="w-full text-center text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] py-2 transition-colors cursor-pointer"
          >
            Lihat semua properti
          </button>
        )}
      </div>
    </section>
  );
};
