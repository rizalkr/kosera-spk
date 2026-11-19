'use client';

import React from 'react';
import { formatCurrency } from '@/utils/format';

export interface PerformanceSummaryPanelProps {
  stats?: {
    totalRooms: number;
    totalOccupiedRooms: number;
    totalViews: number;
    totalRevenue: number;
  };
  kosCount: number;
}

export const PerformanceSummaryPanel: React.FC<PerformanceSummaryPanelProps> = ({
  stats,
  kosCount,
}) => {
  if (!stats || kosCount === 0) return null;

  const { totalRooms = 0, totalOccupiedRooms = 0, totalViews = 0, totalRevenue = 0 } = stats;
  const occupancyPct = totalRooms > 0 ? Math.round((totalOccupiedRooms / totalRooms) * 100) : 0;
  const avgViews = kosCount > 0 ? Math.round(totalViews / kosCount) : 0;
  const avgRevenue = kosCount > 0 ? Math.round(totalRevenue / kosCount) : 0;

  return (
    <section className="bg-[var(--bg-surface)] rounded-[16px] border border-[var(--border-stone)] p-6">
      <h3 className="text-base font-bold text-[var(--ink-primary)] mb-5">Ringkasan Performa</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-center">
          <div className="font-mono-tabular text-2xl font-bold text-[var(--accent-primary)]">
            {occupancyPct}%
          </div>
          <p className="text-xs font-semibold text-[var(--ink-primary)] mt-1">
            Rata-rata Tingkat Hunian
          </p>
          <p className="font-mono-tabular text-[11px] text-[var(--ink-secondary)] mt-0.5">
            {totalOccupiedRooms} dari {totalRooms} kamar terisi
          </p>
        </div>

        <div className="p-4 rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-center">
          <div className="font-mono-tabular text-2xl font-bold text-[var(--ink-primary)]">
            {avgViews.toLocaleString('id-ID')}
          </div>
          <p className="text-xs font-semibold text-[var(--ink-primary)] mt-1">
            Rata-rata Dilihat per Kos
          </p>
          <p className="font-mono-tabular text-[11px] text-[var(--ink-secondary)] mt-0.5">
            {totalViews.toLocaleString('id-ID')} total dilihat
          </p>
        </div>

        <div className="p-4 rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] text-center">
          <div className="font-mono-tabular text-2xl font-bold text-[var(--accent-primary)]">
            {formatCurrency(avgRevenue)}
          </div>
          <p className="text-xs font-semibold text-[var(--ink-primary)] mt-1">
            Rata-rata Pendapatan per Kos
          </p>
          <p className="font-mono-tabular text-[11px] text-[var(--ink-secondary)] mt-0.5">
            {formatCurrency(totalRevenue)} total
          </p>
        </div>
      </div>
    </section>
  );
};
