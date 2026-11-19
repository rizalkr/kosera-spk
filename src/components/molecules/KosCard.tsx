'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardFooter } from '@/components/atoms';
import { formatCurrency } from '@/utils/format';

export interface KosStatistics {
  totalBookings: number;
  pendingBookings: number;
  occupiedRooms: number;
  vacantRooms: number;
  totalRooms: number;
  totalRevenue: number;
  totalRoomsRentedOut: number;
}

export interface KosCardBase {
  id: number;
  name: string;
  city: string;
  address: string;
  price: number;
  viewCount: number;
  createdAt: string;
  totalRooms?: number;
  occupiedRooms?: number;
  vacantRooms?: number;
  totalBookings?: number;
  pendingBookings?: number;
  totalRevenue?: number;
  totalRoomsRentedOut?: number;
  statistics?: KosStatistics;
}

export interface KosCardProps {
  kosData: KosCardBase;
  formatCurrency?: (amount: number) => string;
}

/**
 * Molecule: KosCard - summary card for a seller kos property.
 * Supports both flattened and nested statistics metrics.
 */
export const KosCard: React.FC<KosCardProps> = ({
  kosData,
  formatCurrency: formatFn = formatCurrency,
}) => {
  const router = useRouter();
  const stats = kosData.statistics;

  const num = (value: unknown, fallback = 0): number => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };

  const totalRooms = num(kosData.totalRooms ?? stats?.totalRooms);
  const occupiedRoomsRawRoot = kosData.occupiedRooms;
  const occupiedRoomsRawStats = stats?.occupiedRooms;
  const occupiedRooms = num(
    occupiedRoomsRawRoot === undefined && occupiedRoomsRawStats === undefined
      ? 0
      : Math.max(num(occupiedRoomsRawRoot, 0), num(occupiedRoomsRawStats, 0))
  );
  const vacantRooms = num(
    kosData.vacantRooms ?? stats?.vacantRooms ?? totalRooms - occupiedRooms
  );
  const totalBookings = num(kosData.totalBookings ?? stats?.totalBookings);
  const pendingBookings = num(kosData.pendingBookings ?? stats?.pendingBookings);
  const totalRevenue = num(kosData.totalRevenue ?? stats?.totalRevenue);
  const totalRoomsRentedOut = num(kosData.totalRoomsRentedOut ?? stats?.totalRoomsRentedOut);
  const viewCount = num(kosData.viewCount);
  const price = num(kosData.price);
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <Card
      className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] overflow-hidden card-tactile-lift"
      padding="lg"
    >
      <div className="flex justify-between items-start gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[var(--ink-primary)] truncate">{kosData.name}</h3>
          <p className="text-xs font-medium text-[var(--accent-primary)] mt-0.5">{kosData.city}</p>
          <p className="text-xs text-[var(--ink-secondary)] mt-1 line-clamp-1">{kosData.address}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono-tabular text-base font-bold text-[var(--ink-primary)]">
            {formatFn(price)}
          </p>
          <p className="text-[11px] text-[var(--ink-secondary)]">per bulan</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px]">
          <p className="font-mono-tabular text-lg font-bold text-[var(--ink-primary)]">
            {totalBookings}
          </p>
          <p className="text-[11px] text-[var(--ink-secondary)]">Total Booking</p>
          {pendingBookings > 0 && (
            <p className="font-mono-tabular text-[10px] font-semibold text-[var(--accent-spark)] mt-0.5">
              {pendingBookings} menunggu
            </p>
          )}
        </div>
        <div className="p-3 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px]">
          <p className="font-mono-tabular text-lg font-bold text-[var(--ink-primary)]">
            {viewCount}
          </p>
          <p className="text-[11px] text-[var(--ink-secondary)]">Dilihat</p>
        </div>
        <div className="p-3 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px]">
          <p className="font-mono-tabular text-lg font-bold text-[var(--accent-primary)]">
            {occupiedRooms}
          </p>
          <p className="text-[11px] text-[var(--ink-secondary)]">Terisi</p>
        </div>
        <div className="p-3 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px]">
          <p className="font-mono-tabular text-lg font-bold text-[var(--ink-primary)]">
            {vacantRooms}
          </p>
          <p className="text-[11px] text-[var(--ink-secondary)]">Kosong</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-[var(--ink-secondary)]">Tingkat Hunian</span>
          <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
            {occupancyRate}%
          </span>
        </div>
        <div className="w-full bg-[var(--bg-muted)] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[var(--accent-primary)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>

        <div className="flex justify-between items-center pt-2 text-xs">
          <span className="text-[var(--ink-secondary)]">Total Pendapatan</span>
          <span className="font-mono-tabular font-bold text-[var(--accent-primary)]">
            {formatFn(totalRevenue)}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-[var(--ink-secondary)]">Kamar Tersewa (Historis)</span>
          <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
            {totalRoomsRentedOut}
          </span>
        </div>
      </div>

      <CardFooter className="flex justify-between items-center mt-5 pt-4 border-t border-[var(--border-stone)]">
        <p className="font-mono-tabular text-[11px] text-[var(--ink-secondary)]">
          Dibuat {new Date(kosData.createdAt).toLocaleDateString('id-ID')}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push(`/seller/kos/${kosData.id}`)}
            className="px-3 py-1.5 rounded-[8px] text-xs font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer"
          >
            Lihat
          </button>
          <button
            type="button"
            onClick={() => router.push(`/seller/kos/${kosData.id}/edit`)}
            className="px-3 py-1.5 rounded-[8px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
