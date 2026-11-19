'use client';

import React from 'react';
import { StatCard } from '@/components/molecules';
import { formatCurrency } from '@/utils/format';

export interface OverviewStatsValues {
  totalKos: number;
  totalBookings: number;
  totalPendingBookings: number;
  totalOccupiedRooms: number;
  totalRooms: number;
  totalVacantRooms: number;
  totalRevenue: number;
  totalViews: number;
  totalFavorites: number;
}

export interface OverviewStatsPanelProps {
  stats?: OverviewStatsValues;
}

export const OverviewStatsPanel: React.FC<OverviewStatsPanelProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Kos"
          value={stats.totalKos ?? 0}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Total Booking"
          value={stats.totalBookings ?? 0}
          subtitle={`${stats.totalPendingBookings ?? 0} menunggu`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          color="green"
        />
        <StatCard
          title="Kamar Terisi"
          value={`${stats.totalOccupiedRooms ?? 0}/${stats.totalRooms ?? 0}`}
          subtitle={`${stats.totalVacantRooms ?? 0} kosong`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4v16" />
              <path d="M2 8h18a2 2 0 012 2v10" />
              <path d="M2 17h20" />
              <path d="M6 8v9" />
            </svg>
          }
          color="yellow"
        />
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(stats.totalRevenue ?? 0)}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <StatCard
          title="Total Dilihat"
          value={(stats.totalViews ?? 0).toLocaleString('id-ID')}
          subtitle="di seluruh properti"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Total Favorit"
          value={(stats.totalFavorites ?? 0).toLocaleString('id-ID')}
          subtitle="disimpan pencari kos"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          }
          color="red"
        />
      </div>
    </div>
  );
};
