import React from 'react';

export interface StatsRowProps {
  counts: { totalKos: number; activeKos: number; pendingKos: number; totalPrice: number };
  formatTotalPrice: () => string;
}

export const StatsRow: React.FC<StatsRowProps> = ({ counts, formatTotalPrice }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4">
      <div className="font-mono-tabular text-2xl font-bold text-[var(--ink-primary)]">
        {counts.totalKos}
      </div>
      <div className="text-xs font-medium text-[var(--ink-secondary)] mt-0.5">Total Kos</div>
    </div>
    <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4">
      <div className="font-mono-tabular text-2xl font-bold text-[var(--accent-primary)]">
        {counts.activeKos}
      </div>
      <div className="text-xs font-medium text-[var(--ink-secondary)] mt-0.5">Kos Aktif</div>
    </div>
    <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4">
      <div className="font-mono-tabular text-2xl font-bold text-[var(--accent-spark)]">
        {counts.pendingKos}
      </div>
      <div className="text-xs font-medium text-[var(--ink-secondary)] mt-0.5">
        Menunggu Verifikasi
      </div>
    </div>
    <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4">
      <div className="font-mono-tabular text-xl font-bold text-[var(--ink-primary)] truncate">
        {formatTotalPrice()}
      </div>
      <div className="text-xs font-medium text-[var(--ink-secondary)] mt-0.5">Total Harga Sewa</div>
    </div>
  </div>
);
