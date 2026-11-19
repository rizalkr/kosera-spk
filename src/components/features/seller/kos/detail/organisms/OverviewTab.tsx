import React from 'react';
import type { SellerKosDetail } from '@/types/seller-kos';
import type { UseSellerKosDetailViewResult } from '@/hooks/seller/kos/useSellerKosDetailView';
import { StatCard } from '../atoms/StatCard';
import { RoomStatusPanel } from '../molecules/RoomStatusPanel';
import { PropertyInfoPanel } from '../molecules/PropertyInfoPanel';

export interface OverviewTabProps {
  kos: SellerKosDetail;
  view: Pick<
    UseSellerKosDetailViewResult,
    'statistics' | 'occupancyRate' | 'formatCurrency' | 'formatDate' | 'getKosStatus'
  >;
  onEdit: () => void;
  onPhotos: () => void;
  onPublicView: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kos,
  view,
  onEdit,
  onPhotos,
  onPublicView,
}) => {
  const { statistics, occupancyRate, formatCurrency, formatDate, getKosStatus } = view;
  const avgPerRoom = statistics.totalRooms > 0 ? statistics.totalRevenue / statistics.totalRooms : 0;
  const status = getKosStatus();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={statistics.totalBookings}
          label="Total Booking"
          color="blue"
          extra={statistics.pendingBookings > 0 && `${statistics.pendingBookings} menunggu`}
        />
        <StatCard value={statistics.totalViews} label="Total Dilihat" color="green" />
        <StatCard
          value={`${occupancyRate}%`}
          label="Tingkat Hunian"
          color="purple"
          extra={`${statistics.occupiedRooms}/${statistics.totalRooms} kamar`}
        />
        <StatCard
          value={formatCurrency(statistics.totalRevenue)}
          label="Total Pendapatan"
          color="yellow"
        />
      </div>

      <RoomStatusPanel
        totalRooms={statistics.totalRooms}
        occupiedRooms={statistics.occupiedRooms}
        vacantRooms={statistics.vacantRooms}
        occupancyRate={occupancyRate}
      />

      <PropertyInfoPanel
        kos={kos}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        status={status}
        totalRoomsRentedOut={statistics.totalRoomsRentedOut}
        totalRevenue={statistics.totalRevenue}
        avgPerRoom={avgPerRoom}
      />

      <div className="bg-[var(--bg-canvas)] rounded-[16px] p-6 border border-[var(--border-stone)]">
        <h3 className="text-base font-bold text-[var(--ink-primary)] mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <button
            type="button"
            onClick={onPublicView}
            className="flex items-center justify-center gap-2 bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] text-[var(--ink-primary)] p-3.5 rounded-[12px] text-xs font-semibold transition-colors border border-[var(--border-stone)] cursor-pointer"
          >
            <span>Lihat Sebagai Pengunjung</span>
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white p-3.5 rounded-[12px] text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Edit Informasi</span>
          </button>
          <button
            type="button"
            onClick={onPhotos}
            className="flex items-center justify-center gap-2 bg-[var(--accent-tint)] hover:bg-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-white border border-[#BBDCD0] p-3.5 rounded-[12px] text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Kelola Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
