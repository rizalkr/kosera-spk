import React from 'react';
import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/types';

export interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const statusMap: Record<BookingStatus, { label: string; classes: string }> = {
  pending: {
    label: 'Menunggu Konfirmasi',
    classes: 'bg-[var(--accent-spark-tint)] text-[#9A471F] border border-[#F2CDBB]',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    classes: 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border border-[#BBDCD0]',
  },
  cancelled: {
    label: 'Dibatalkan',
    classes: 'bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] border border-[#ECC6C0]',
  },
  completed: {
    label: 'Selesai',
    classes: 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border border-[var(--border-stone)]',
  },
};

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, className }) => {
  const cfg = statusMap[status] ?? statusMap.pending;
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
        cfg.classes,
        className
      )}
    >
      {cfg.label}
    </span>
  );
};

export const getBookingStatusLabel = (status: BookingStatus) =>
  (statusMap[status] ?? statusMap.pending).label;

export const getBookingStatusColorClasses = (status: BookingStatus) =>
  (statusMap[status] ?? statusMap.pending).classes;
