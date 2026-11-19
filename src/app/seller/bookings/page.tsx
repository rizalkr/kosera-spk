'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useBookings, useUpdateBooking } from '@/hooks/useApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { showConfirm } from '@/lib/sweetalert';
import { cn } from '@/lib/utils';
import { BookingCard } from '@/components/bookings/BookingCard';
import { Pagination } from '@/components/ui/Pagination';
import type { ApiResponse, BookingListData, BookingStatus } from '@/types';

const STATUS_VALUES: (BookingStatus | 'all')[] = [
  'all',
  'pending',
  'confirmed',
  'cancelled',
  'completed',
];

function SellerBookingsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const statusParam = (searchParams.get('status') as BookingStatus | 'all' | null) || 'all';

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(statusParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);

  const { data, isLoading, error, refetch } = useBookings({
    page: currentPage,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  });
  const updateBookingMutation = useUpdateBooking();

  useEffect(() => {
    if (statusParam !== selectedStatus) setSelectedStatus(statusParam);
    if (pageParam !== currentPage) setCurrentPage(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusParam, pageParam]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (currentPage > 1) params.set('page', String(currentPage));
    const qs = params.toString();
    router.replace(`/seller/bookings${qs ? `?${qs}` : ''}`);
  }, [selectedStatus, currentPage, router]);

  const response = data as ApiResponse<BookingListData> | undefined;
  const bookings = response?.data?.bookings || [];
  const pagination = response?.data?.pagination;

  const handleConfirm = async (id: number) => {
    const r = await showConfirm('Konfirmasi booking ini?', 'Konfirmasi', 'Ya', 'Batal');
    if (r.isConfirmed) updateBookingMutation.mutate({ id, status: 'confirmed' });
  };

  const handleCancel = async (id: number) => {
    const r = await showConfirm('Batalkan booking ini?', 'Konfirmasi', 'Ya', 'Batal');
    if (r.isConfirmed) {
      updateBookingMutation.mutate({
        id,
        status: 'cancelled',
        notes: 'Booking dibatalkan oleh pemilik',
      });
    }
  };

  const onPageChange = (p: number) => {
    if (p < 1 || (pagination && p > pagination.totalPages)) return;
    setCurrentPage(p);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-[var(--bg-muted)] rounded-[14px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center text-sm text-[var(--accent-danger)]">
          Gagal memuat data booking.{' '}
          <button
            type="button"
            onClick={() => refetch()}
            className="underline font-semibold cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
              Booking Kos Saya
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Tinjau dan konfirmasi pengajuan sewa kamar dari calon penyewa.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => router.push('/seller/dashboard')}
              className="px-4 py-2 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-[10px] bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_VALUES.map((st) => {
            const count = bookings.filter((b) => b.status === st).length;
            const totalAll = pagination?.totalBookings ?? bookings.length;
            const labelMap: Record<string, string> = {
              all: 'Semua',
              pending: 'Menunggu',
              confirmed: 'Dikonfirmasi',
              cancelled: 'Dibatalkan',
              completed: 'Selesai',
            };
            const badgeCount = st === 'all' ? totalAll : selectedStatus === st ? count : null;

            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  setSelectedStatus(st);
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer',
                  selectedStatus === st
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-muted)] text-[var(--ink-secondary)] border-[var(--border-stone)] hover:text-[var(--ink-primary)]'
                )}
              >
                <span>{labelMap[st]}</span>
                {badgeCount !== null && (
                  <span className="font-mono-tabular opacity-90">({badgeCount})</span>
                )}
              </button>
            );
          })}
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-14 px-4 space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[var(--ink-primary)]">
              {selectedStatus === 'all'
                ? 'Belum ada booking'
                : 'Tidak ada booking untuk status ini'}
            </h3>
            <p className="text-sm text-[var(--ink-secondary)]">
              Lengkapi foto dan fasilitas kos untuk menarik lebih banyak calon penyewa.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  role="SELLER"
                  isMutating={updateBookingMutation.isPending}
                  actions={{
                    onConfirm: handleConfirm,
                    onCancel: handleCancel,
                    onDetail: (id) => router.push(`/seller/bookings/${id}`),
                  }}
                />
              ))}
            </div>
            {pagination && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SellerBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-sm text-[var(--ink-secondary)]">Memuat daftar booking...</div>
        </div>
      }
    >
      <SellerBookingsPageInner />
    </Suspense>
  );
}
