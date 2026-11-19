import React from 'react';
import { SellerKosTab } from '@/hooks/seller/kos/useSellerKosDetailView';

export interface PlaceholderTabProps {
  type: Exclude<SellerKosTab, 'overview'>;
  statistics: { totalBookings: number; pendingBookings: number; totalViews: number };
  occupancyRate: number;
  viewCount: number;
}

const placeholderContent = {
  bookings: {
    title: 'Ringkasan Booking Properti',
    desc: 'Gunakan halaman Booking Kos Saya untuk meninjau dan mengonfirmasi setiap pengajuan penyewa.',
    extra: (stats: PlaceholderTabProps['statistics']) => (
      <div className="bg-[var(--accent-tint)] border border-[#BBDCD0] rounded-[12px] p-4 max-w-md mx-auto">
        <p className="text-xs sm:text-sm text-[var(--accent-primary)]">
          <span className="font-semibold">Info:</span> Saat ini tercatat{' '}
          <span className="font-mono-tabular font-semibold">{stats.totalBookings}</span> total
          booking
          {stats.pendingBookings > 0 && ` dengan ${stats.pendingBookings} menunggu konfirmasi`}.
        </p>
      </div>
    ),
  },
  analytics: {
    title: 'Analitik Mendalam Segera Hadir',
    desc: 'Pantau performa penayangan dan tingkat hunian kos Anda secara berkala.',
    extra: (_: PlaceholderTabProps['statistics'], viewCount: number, occupancyRate: number) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-4">
          <div className="font-mono-tabular text-2xl font-bold text-[var(--ink-primary)]">
            {viewCount}
          </div>
          <div className="text-xs text-[var(--ink-secondary)] mt-0.5">Total Views</div>
        </div>
        <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-4">
          <div className="font-mono-tabular text-2xl font-bold text-[var(--accent-primary)]">
            {occupancyRate}%
          </div>
          <div className="text-xs text-[var(--ink-secondary)] mt-0.5">Tingkat Hunian</div>
        </div>
      </div>
    ),
  },
  settings: {
    title: 'Pengaturan Kos',
    desc: 'Kelola pengaturan lanjutan dan preferensi publikasi untuk properti kos Anda.',
    extra: () => null,
  },
} as const;

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({
  type,
  statistics,
  occupancyRate,
  viewCount,
}) => {
  const item = placeholderContent[type];
  return (
    <div className="text-center py-10 space-y-4">
      <h3 className="text-lg font-bold text-[var(--ink-primary)]">{item.title}</h3>
      <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto">{item.desc}</p>
      {type === 'bookings' && placeholderContent.bookings.extra(statistics)}
      {type === 'analytics' &&
        placeholderContent.analytics.extra(statistics, viewCount, occupancyRate)}
    </div>
  );
};
