'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import KosImage from '@/components/ui/KosImage';
import type { BookingApiResponse, BookingDetailData, BookingStatus } from '@/types';
import { showConfirm } from '@/lib/sweetalert';
import { useUpdateBooking } from '@/hooks/useApi';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { apiClient } from '@/lib/api/client';
import { formatRupiah } from '@/lib/utils/discovery';

const fetchBooking = async (id: string): Promise<BookingDetailData> => {
  const res = (await apiClient.get(`/api/bookings/${id}`)) as BookingApiResponse;
  if (!res.success || !res.data?.booking) throw new Error(res.error || 'Gagal memuat booking');
  return res.data.booking;
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-2.5 border-b border-[var(--border-stone)] last:border-b-0">
    <span className="text-[var(--ink-secondary)] text-xs font-medium">{label}</span>
    <span className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)] text-right max-w-[60%]">
      {value}
    </span>
  </div>
);

function SellerBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookingId = params?.id as string;
  const queryClient = useQueryClient();
  const updateMutation = useUpdateBooking();

  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (updateMutation.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      refetch();
    }
  }, [updateMutation.isSuccess, queryClient, bookingId, refetch]);

  const handleAction = async (next: BookingStatus, confirmText: string, notes?: string) => {
    if (!booking) return;
    const r = await showConfirm(confirmText, 'Konfirmasi', 'Ya', 'Batal');
    if (!r.isConfirmed) return;
    updateMutation.mutate({ id: booking.id, status: next, notes });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
              Detail Booking
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => router.push('/seller/dashboard')}
                className="text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <span className="text-[var(--border-stone)]">/</span>
              <button
                type="button"
                onClick={() => router.push('/seller/bookings')}
                className="text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
              >
                Daftar Booking
              </button>
              <span className="text-[var(--border-stone)]">/</span>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={updateMutation.isPending}
                className="text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] disabled:opacity-50 cursor-pointer"
              >
                Muat Ulang
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-3.5 py-2 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
          >
            Kembali
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-sm text-[var(--ink-secondary)]">
            Memuat detail booking...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-sm text-[var(--accent-danger)]">
            Gagal memuat detail.{' '}
            <button
              type="button"
              onClick={() => refetch()}
              className="underline font-semibold cursor-pointer"
            >
              Coba lagi
            </button>
          </div>
        )}

        {booking && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-72 h-48 bg-[var(--bg-muted)] rounded-[14px] overflow-hidden shrink-0">
                <KosImage
                  kosId={booking.kos.id}
                  kosName={booking.kos.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--ink-primary)]">
                      {booking.post.title || booking.kos.name}
                    </h2>
                    <p className="text-sm text-[var(--ink-secondary)] mt-1">
                      {booking.kos.address}, {booking.kos.city}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3.5">
                    <p className="text-[11px] text-[var(--ink-secondary)]">Check-in</p>
                    <p className="font-mono-tabular font-semibold text-[var(--ink-primary)] mt-0.5">
                      {new Date(booking.checkInDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3.5">
                    <p className="text-[11px] text-[var(--ink-secondary)]">Check-out</p>
                    <p className="font-mono-tabular font-semibold text-[var(--ink-primary)] mt-0.5">
                      {new Date(booking.checkOutDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] p-3.5">
                    <p className="text-[11px] text-[var(--ink-secondary)]">Total Biaya</p>
                    <p className="font-mono-tabular font-bold text-[var(--accent-primary)] mt-0.5">
                      {formatRupiah(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[var(--ink-primary)] mb-3">
                Informasi Penyewa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DetailRow label="Username" value={booking.user.username} />
                <DetailRow label="Nama" value={booking.user.name || '-'} />
                <DetailRow
                  label="Kontak"
                  value={<span className="font-mono-tabular">{booking.user.contact || '-'}</span>}
                />
                <DetailRow
                  label="ID Penyewa"
                  value={<span className="font-mono-tabular">#{booking.user.id}</span>}
                />
              </div>
            </div>

            <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-5">
              <h3 className="text-sm font-bold text-[var(--ink-primary)] mb-3">Rincian Booking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DetailRow
                  label="ID Booking"
                  value={<span className="font-mono-tabular">#{booking.id}</span>}
                />
                <DetailRow label="Status" value={<BookingStatusBadge status={booking.status} />} />
                <DetailRow
                  label="Durasi"
                  value={<span className="font-mono-tabular">{booking.duration ?? '-'} bulan</span>}
                />
                <DetailRow
                  label="Dibuat"
                  value={
                    <span className="font-mono-tabular">
                      {new Date(booking.createdAt).toLocaleString('id-ID')}
                    </span>
                  }
                />
                <DetailRow
                  label="Diperbarui"
                  value={
                    <span className="font-mono-tabular">
                      {new Date(booking.updatedAt).toLocaleString('id-ID')}
                    </span>
                  }
                />
                <DetailRow label="Catatan" value={booking.notes || '-'} />
              </div>
            </div>

            {booking.status === 'pending' && (
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('confirmed', 'Konfirmasi booking ini?')}
                  disabled={updateMutation.isPending}
                  className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {updateMutation.isPending ? 'Memproses...' : 'Konfirmasi Booking'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAction(
                      'cancelled',
                      'Batalkan booking ini?',
                      'Booking dibatalkan oleh pemilik'
                    )
                  }
                  disabled={updateMutation.isPending}
                  className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[#ECC6C0] bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] hover:bg-[var(--accent-danger)] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {updateMutation.isPending ? 'Memproses...' : 'Batalkan'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerBookingDetailPage;
