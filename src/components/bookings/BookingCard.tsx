import React from 'react';
import KosImage from '@/components/ui/KosImage';
import { formatRupiah } from '@/lib/utils/discovery';
import { BookingStatusBadge } from './BookingStatusBadge';
import type { BookingStatus, BookingData } from '@/types';

export interface BookingCardActions {
  onConfirm?: (id: number) => void;
  onCancel?: (id: number) => void;
  onComplete?: (id: number) => void;
  onDetail?: (id: number) => void;
}

export interface BookingCardProps {
  booking: BookingData & { duration?: number; notes?: string };
  role: 'RENTER' | 'SELLER';
  isMutating?: boolean;
  actions?: BookingCardActions;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  role,
  isMutating,
  actions,
}) => {
  const { id, kos, checkInDate, checkOutDate, totalPrice, status, duration } = booking;

  return (
    <article className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 card-tactile-lift">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-48 h-36 rounded-[12px] overflow-hidden relative bg-[var(--bg-muted)] shrink-0">
          <KosImage kosId={kos.id} kosName={kos.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[var(--ink-primary)] line-clamp-1">
                  {kos.name}
                </h3>
                <p className="font-mono-tabular text-xs text-[var(--ink-secondary)] mt-0.5">
                  ID Kos #{kos.id} · Booking #{id}
                </p>
              </div>
              <BookingStatusBadge status={status as BookingStatus} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-stone)]">
              <div>
                <p className="text-[11px] font-medium text-[var(--ink-secondary)]">Check-in</p>
                <p className="font-mono-tabular text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mt-0.5">
                  {new Date(checkInDate).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[var(--ink-secondary)]">Check-out</p>
                <p className="font-mono-tabular text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mt-0.5">
                  {new Date(checkOutDate).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[var(--ink-secondary)]">Durasi</p>
                <p className="font-mono-tabular text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mt-0.5">
                  {duration ?? '-'} bulan
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[var(--ink-secondary)]">Total Biaya</p>
                <p className="font-mono-tabular text-sm font-bold text-[var(--accent-primary)] mt-0.5">
                  {formatRupiah(totalPrice)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-stone)]">
            {role === 'SELLER' && status === 'pending' && (
              <>
                {!!actions?.onConfirm && (
                  <button
                    type="button"
                    onClick={() => actions.onConfirm?.(id)}
                    disabled={isMutating}
                    className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isMutating ? 'Memproses...' : 'Konfirmasi'}
                  </button>
                )}
                {!!actions?.onCancel && (
                  <button
                    type="button"
                    onClick={() => actions.onCancel?.(id)}
                    disabled={isMutating}
                    className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[#ECC6C0] bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] hover:bg-[var(--accent-danger)] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isMutating ? 'Memproses...' : 'Batalkan'}
                  </button>
                )}
              </>
            )}

            {role === 'SELLER' && status === 'confirmed' && !!actions?.onComplete && (
              <button
                type="button"
                onClick={() => actions.onComplete?.(id)}
                disabled={isMutating}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--ink-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isMutating ? 'Memproses...' : 'Tandai Selesai'}
              </button>
            )}

            {role === 'RENTER' && status === 'pending' && !!actions?.onCancel && (
              <button
                type="button"
                onClick={() => actions.onCancel?.(id)}
                disabled={isMutating}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[#ECC6C0] bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] hover:bg-[var(--accent-danger)] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isMutating ? 'Membatalkan...' : 'Batalkan'}
              </button>
            )}

            {!!actions?.onDetail && (
              <button
                type="button"
                onClick={() => actions.onDetail?.(id)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
              >
                Lihat Detail
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
