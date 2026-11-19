'use client';

import React from 'react';

export interface TipsInsightsStats {
  totalPendingBookings: number;
  totalVacantRooms: number;
  totalOccupiedRooms: number;
  totalViews: number;
  totalBookings: number;
  totalRooms: number;
}

export interface TipsInsightsPanelProps {
  stats?: TipsInsightsStats;
  kosCount: number;
}

export const TipsInsightsPanel: React.FC<TipsInsightsPanelProps> = ({ stats, kosCount }) => {
  if (kosCount === 0 || !stats) return null;

  const {
    totalPendingBookings = 0,
    totalVacantRooms = 0,
    totalOccupiedRooms = 0,
    totalViews = 0,
    totalBookings = 0,
    totalRooms = 0,
  } = stats;
  const highOccupancy = totalRooms > 0 && totalOccupiedRooms / totalRooms >= 0.8;
  const occupancyPct = totalRooms > 0 ? Math.round((totalOccupiedRooms / totalRooms) * 100) : 0;

  const hasInsights =
    totalPendingBookings > 0 ||
    totalVacantRooms > totalOccupiedRooms ||
    (totalViews > 0 && totalBookings === 0) ||
    highOccupancy;

  if (!hasInsights) return null;

  return (
    <section className="bg-[var(--bg-surface)] rounded-[16px] border border-[var(--border-stone)] p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-[10px] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[var(--ink-primary)]">Insight &amp; Rekomendasi</h3>
      </div>

      <div className="space-y-3">
        {totalPendingBookings > 0 && (
          <div className="bg-[var(--accent-spark-tint)] border border-[#F2CDBB] rounded-[12px] p-3.5">
            <p className="text-xs sm:text-sm text-[#9A471F]">
              <span className="font-semibold">Perlu Tindakan:</span> Anda memiliki{' '}
              <span className="font-mono-tabular font-semibold">{totalPendingBookings}</span>{' '}
              booking yang menunggu konfirmasi.
            </p>
          </div>
        )}

        {totalVacantRooms > totalOccupiedRooms && (
          <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3.5">
            <p className="text-xs sm:text-sm text-[var(--ink-primary)]">
              <span className="font-semibold">Peluang Hunian:</span> Masih tersedia{' '}
              <span className="font-mono-tabular font-semibold">{totalVacantRooms}</span> kamar
              kosong. Lengkapi foto ruangan dan fasilitas agar skor kecocokan SPK meningkat.
            </p>
          </div>
        )}

        {totalViews > 0 && totalBookings === 0 && (
          <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3.5">
            <p className="text-xs sm:text-sm text-[var(--ink-primary)]">
              <span className="font-semibold">Optimasi Listing:</span> Properti sudah dilihat calon
              penyewa namun belum menghasilkan booking. Perjelas deskripsi aturan kos dan unggah foto
              terbaru.
            </p>
          </div>
        )}

        {highOccupancy && (
          <div className="bg-[var(--accent-tint)] border border-[#BBDCD0] rounded-[12px] p-3.5">
            <p className="text-xs sm:text-sm text-[var(--accent-primary)]">
              <span className="font-semibold">Performa Tinggi:</span> Tingkat hunian Anda mencapai{' '}
              <span className="font-mono-tabular font-semibold">{occupancyPct}%</span>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
