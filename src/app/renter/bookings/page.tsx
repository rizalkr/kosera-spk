'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import { useBookings, useUpdateBooking } from '@/hooks/useApi';
import { showConfirm } from '@/lib/sweetalert';
import { cn } from '@/lib/utils';
import { BookingCard } from '@/components/bookings/BookingCard';
import { Pagination } from '@/components/ui/Pagination';
import type { ApiResponse, BookingListData, BookingStatus } from '@/types';

const STATUS_VALUES: (BookingStatus | 'all')[] = ['all', 'pending', 'confirmed', 'completed'];

function RenterBookingsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const statusParam = (searchParams.get('status') as BookingStatus | 'all' | null) || 'all';

  const { user } = useAuthGuard();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(statusParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);

  const { data: bookingsData, isLoading, error, refetch } = useBookings({
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
    router.replace(`/renter/bookings${qs ? `?${qs}` : ''}`);
  }, [selectedStatus, currentPage, router]);

  const response = bookingsData as ApiResponse<BookingListData> | undefined;
  const bookings = response?.data?.bookings || [];
  const pagination = response?.data?.pagination;

  const handleCancel = async (id: number) => {
    const r = await showConfirm(
      'Apakah Anda yakin ingin membatalkan booking ini?',
      'Konfirmasi Pembatalan',
      'Ya, Batalkan',
      'Tidak'
    );
    if (r.isConfirmed) {
      updateBookingMutation.mutate({
        id,
        status: 'cancelled',
        notes: 'Booking dibatalkan oleh pengguna',
      });
    }
  };

  const onPageChange = (p: number) => {
    if (p < 1 || (pagination && p > pagination.totalPages)) return;
    setCurrentPage(p);
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 animate-pulse space-y-5">
              <div className="h-7 bg-[var(--bg-muted)] rounded w-48" />
              <div className="h-9 bg-[var(--bg-muted)] rounded-full w-80" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-[var(--bg-muted)] rounded-[16px]"
                />
              ))}
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 sm:p-10 text-center space-y-4">
              <p className="text-sm font-medium text-[var(--accent-danger)]">
                Gagal memuat data booking: {error.message}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['RENTER']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                  Booking Saya
                </h1>
                <p className="text-sm text-[var(--ink-secondary)] mt-1">
                  Halo <span className="font-semibold text-[var(--ink-primary)]">{user?.username}</span>, pantau seluruh status pengajuan sewa kos Anda.
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-xs font-semibold text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_VALUES.map((st) => {
                const count = bookings.filter((b) => b.status === st).length;
                const totalAll = pagination?.totalBookings ?? bookings.length;
                const labelMap: Record<string, string> = {
                  all: 'Semua',
                  pending: 'Menunggu',
                  confirmed: 'Dikonfirmasi',
                  completed: 'Selesai',
                };
                const badgeCount =
                  st === 'all' ? totalAll : selectedStatus === st ? count : null;

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
              <div className="text-center py-12 px-4 space-y-4">
                <div className="h-14 w-14 mx-auto rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
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
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-[var(--ink-primary)]">
                    {selectedStatus === 'all'
                      ? 'Belum ada booking'
                      : 'Tidak ada booking untuk status ini'}
                  </h2>
                  <p className="text-sm text-[var(--ink-secondary)] max-w-md mx-auto">
                    {selectedStatus === 'all'
                      ? 'Mulai jelajahi daftar kos di Semarang dan ajukan booking kamar pilihan Anda.'
                      : 'Coba pilih filter status lain untuk melihat riwayat booking Anda.'}
                  </p>
                </div>
                <Link
                  href="/list"
                  className="inline-flex items-center px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                  Jelajahi Kos
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      role="RENTER"
                      isMutating={updateBookingMutation.isPending}
                      actions={{
                        onCancel: handleCancel,
                        onDetail: (id) => router.push(`/renter/bookings/${id}`),
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
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default function RenterBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-canvas)] pt-16 px-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-7 py-5 text-sm font-medium text-[var(--ink-secondary)]">
            Memuat daftar booking...
          </div>
        </div>
      }
    >
      <RenterBookingsPageInner />
    </Suspense>
  );
}
