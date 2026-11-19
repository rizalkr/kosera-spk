'use client';

import { useEffect } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import KosImage from '@/components/ui/KosImage';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { useAuthGuard } from '@/hooks/auth/useAuthGuard';
import { useBookings, useUpdateBooking } from '@/hooks/useApi';
import { showSuccess } from '@/lib/sweetalert';
import { formatRupiah } from '@/lib/utils/discovery';
import type { BookingStatus } from '@/types';

type BookingItem = {
  id: number;
  kos: {
    id: number;
    name: string;
    address: string;
    city: string;
    facilities: string;
  };
  post: {
    id: number;
    title: string;
    price: number;
  };
  checkInDate: string;
  checkOutDate: string;
  duration: number;
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

function toBookingStatus(value: string): BookingStatus {
  if (
    value === 'pending' ||
    value === 'confirmed' ||
    value === 'cancelled' ||
    value === 'completed'
  ) {
    return value;
  }
  return 'pending';
}

export default function BookingsPage() {
  const { user } = useAuthGuard();
  const { data: bookingsData, isLoading, error } = useBookings();
  const updateBookingMutation = useUpdateBooking();

  useEffect(() => {
    if (user?.role === 'RENTER') {
      window.location.href = '/renter/bookings';
    } else if (user?.role === 'SELLER') {
      window.location.href = '/seller/kos';
    }
  }, [user]);

  const bookingsResponse = bookingsData?.data as unknown;
  const bookings: BookingItem[] =
    bookingsResponse &&
    typeof bookingsResponse === 'object' &&
    'bookings' in bookingsResponse
      ? (bookingsResponse as { bookings: BookingItem[] }).bookings
      : [];
  const total = bookings.reduce((sum: number, item: BookingItem) => sum + item.totalPrice, 0);

  function handleRemove(id: number) {
    updateBookingMutation.mutate({
      id,
      status: 'cancelled',
      notes: 'Booking dibatalkan oleh pengguna',
    });
  }

  function handleConfirm() {
    showSuccess('Booking berhasil dikonfirmasi!');
  }

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center text-sm text-[var(--ink-secondary)]">
              Memuat data booking...
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
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center text-sm text-[var(--accent-danger)]">
              Error memuat data: {error.message}
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
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Ringkasan Booking
              </h1>
              <p className="text-sm text-[var(--ink-secondary)] mt-1">
                Selamat datang,{' '}
                <span className="font-semibold text-[var(--ink-primary)]">{user?.username}</span>.
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-[var(--ink-secondary)]">
                Belum ada kos yang dipesan.
              </div>
            ) : (
              <>
                <ul className="divide-y divide-[var(--border-stone)]">
                  {bookings.map((item) => (
                    <li key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                      <div className="w-full sm:w-24 h-24 rounded-[12px] overflow-hidden bg-[var(--bg-muted)] shrink-0">
                        <KosImage
                          kosId={item.kos.id}
                          kosName={item.kos.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-bold text-[var(--ink-primary)]">
                            {item.post.title}
                          </div>
                          <BookingStatusBadge status={toBookingStatus(item.status)} />
                        </div>
                        <div className="text-xs text-[var(--ink-secondary)]">
                          {item.kos.address}, {item.kos.city}
                        </div>
                        <div className="font-mono-tabular text-xs text-[var(--ink-primary)] pt-1">
                          {formatRupiah(item.post.price)} / bulan · Check-in:{' '}
                          {new Date(item.checkInDate).toLocaleDateString('id-ID')} · Durasi:{' '}
                          {item.duration} bulan
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={updateBookingMutation.isPending}
                        className="px-3.5 py-2 rounded-[10px] text-xs font-semibold border border-[#ECC6C0] bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] hover:bg-[var(--accent-danger)] hover:text-white transition-colors disabled:opacity-50 self-start sm:self-center cursor-pointer"
                      >
                        {updateBookingMutation.isPending ? 'Membatalkan...' : 'Batalkan'}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[var(--border-stone)] flex flex-wrap justify-between items-center gap-4">
                  <div className="font-mono-tabular text-lg font-bold text-[var(--accent-primary)]">
                    Total: {formatRupiah(total)}
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                  >
                    Konfirmasi Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
