'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { BookingStatusBadge } from '@/components/bookings/BookingStatusBadge';
import { useAuthToken } from '@/hooks/auth/useAuthToken';
import { showConfirm, showSuccess, showError } from '@/lib/sweetalert';
import { formatRupiah } from '@/lib/utils/discovery';
import type { BookingStatus } from '@/types';

interface BookingDetailResponse {
  success: true;
  message: string;
  data: { booking: BookingDetail };
}
interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}
type BookingDetailApiResponse = BookingDetailResponse | ErrorResponse;

type BookingDetail = {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
    userId: number;
  };
  user: {
    id: number;
    name: string;
    username: string;
    contact: string;
  };
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuthToken();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = params.id as string;

  const fetchBookingDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        setError('Authentication required');
        return;
      }

      const data: BookingDetailApiResponse = await (
        await import('@/lib/api/client')
      ).apiClient.get(`/api/bookings/${bookingId}`, undefined, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (data.success) setBooking(data.data.booking);
      else throw new Error(data.error || 'Failed to load booking');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, getToken]);

  useEffect(() => {
    fetchBookingDetail();
  }, [fetchBookingDetail]);

  const handleCancelBooking = async () => {
    const result = await showConfirm('Apakah Anda yakin ingin membatalkan booking ini?');
    if (!result.isConfirmed) return;

    try {
      const token = getToken();
      if (!token) return;

      const data: BookingDetailApiResponse = await (
        await import('@/lib/api/client')
      ).apiClient.put(
        `/api/bookings/${bookingId}`,
        {
          status: 'cancelled',
          notes: 'Booking dibatalkan oleh pengguna',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (data.success) {
        fetchBookingDetail();
        showSuccess('Booking berhasil dibatalkan');
      } else {
        throw new Error(data.error || 'Failed to cancel booking');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Gagal membatalkan booking');
    }
  };

  const handleContactOwner = () => {
    if (booking) {
      const message = `Halo, saya ingin menanyakan tentang booking kos ${booking.post.title} dengan ID #${booking.id}`;
      const phoneNumber = booking.user.contact.replace(/[^\d]/g, '');
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 animate-pulse space-y-5">
              <div className="h-8 bg-[var(--bg-muted)] rounded w-1/3" />
              <div className="h-32 bg-[var(--bg-muted)] rounded-[14px]" />
              <div className="h-40 bg-[var(--bg-muted)] rounded-[14px]" />
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !booking) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['RENTER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 sm:p-10 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] flex items-center justify-center">
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
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-[var(--ink-primary)]">
                {error || 'Booking tidak ditemukan'}
              </h1>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Kembali
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
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali ke Daftar Booking</span>
            </button>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] overflow-hidden">
            {/* Header */}
            <div className="bg-[var(--bg-muted)] border-b border-[var(--border-stone)] p-6 flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
                  Detail Booking
                </h1>
                <p className="font-mono-tabular text-xs text-[var(--ink-secondary)] mt-1">
                  ID Booking: #{booking.id}
                </p>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="p-6 space-y-8">
              {/* Kos Information & Owner Contact */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-5 space-y-2.5">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-secondary)]">
                    Informasi Kos
                  </h2>
                  <h3 className="text-lg font-bold text-[var(--ink-primary)]">
                    {booking.post.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-secondary)]">
                    {booking.kos.address}, {booking.kos.city}
                  </p>
                  <p className="text-xs text-[var(--ink-secondary)]">
                    Fasilitas: {booking.kos.facilities}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push(`/kos/${booking.kos.id}/view`)}
                    className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                  >
                    <span>Lihat Halaman Kos</span>
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
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-secondary)]">
                      Kontak Pemilik
                    </h2>
                    <p className="text-sm font-bold text-[var(--ink-primary)] pt-1">
                      {booking.user.name}
                    </p>
                    <p className="text-xs text-[var(--ink-secondary)]">@{booking.user.username}</p>
                    <p className="font-mono-tabular text-xs text-[var(--ink-primary)] pt-1">
                      {booking.user.contact}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleContactOwner}
                    className="w-full py-2.5 px-4 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                  >
                    Hubungi via WhatsApp
                  </button>
                </div>
              </div>

              {/* Booking Details & Cost Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-[var(--ink-primary)]">Detail Sewa</h2>
                  <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--ink-secondary)]">Tanggal Check-in</span>
                      <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                        {new Date(booking.checkInDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--ink-secondary)]">Tanggal Check-out</span>
                      <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                        {new Date(booking.checkOutDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--ink-secondary)]">Durasi Sewa</span>
                      <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                        {booking.duration} bulan
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--ink-secondary)]">Tanggal Pengajuan</span>
                      <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                        {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-base font-bold text-[var(--ink-primary)]">Rincian Biaya</h2>
                  <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--ink-secondary)]">Harga per bulan</span>
                      <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                        {formatRupiah(booking.post.price)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[var(--ink-secondary)]">Durasi</span>
                      <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">
                        {booking.duration} bulan
                      </span>
                    </div>
                    <div className="pt-2.5 border-t border-[var(--border-stone)] flex justify-between gap-4 items-center">
                      <span className="font-bold text-[var(--ink-primary)]">Total Harga</span>
                      <span className="font-mono-tabular text-lg font-bold text-[var(--accent-primary)]">
                        {formatRupiah(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-[var(--ink-primary)]">Catatan</h2>
                  <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4">
                    <p className="text-sm text-[var(--ink-primary)]">{booking.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-2">
                <h2 className="text-base font-bold text-[var(--ink-primary)]">Timeline Status</h2>
                <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        booking.status === 'pending'
                          ? 'bg-[var(--accent-spark)]'
                          : 'bg-[var(--border-stone)]'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        booking.status === 'pending'
                          ? 'font-semibold text-[#9A471F]'
                          : 'text-[var(--ink-secondary)]'
                      }`}
                    >
                      Menunggu Konfirmasi
                    </span>
                  </div>
                  <div className="ml-1.5 w-px h-5 bg-[var(--border-stone)]" />
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-[var(--accent-primary)]'
                          : 'bg-[var(--border-stone)]'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        booking.status === 'confirmed'
                          ? 'font-semibold text-[var(--accent-primary)]'
                          : 'text-[var(--ink-secondary)]'
                      }`}
                    >
                      Dikonfirmasi Pemilik
                    </span>
                  </div>
                  <div className="ml-1.5 w-px h-5 bg-[var(--border-stone)]" />
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        booking.status === 'completed'
                          ? 'bg-[var(--ink-primary)]'
                          : booking.status === 'cancelled'
                            ? 'bg-[var(--accent-danger)]'
                            : 'bg-[var(--border-stone)]'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        booking.status === 'completed'
                          ? 'font-semibold text-[var(--ink-primary)]'
                          : booking.status === 'cancelled'
                            ? 'font-semibold text-[var(--accent-danger)]'
                            : 'text-[var(--ink-secondary)]'
                      }`}
                    >
                      {booking.status === 'cancelled' ? 'Dibatalkan' : 'Selesai'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--border-stone)]">
                {booking.status === 'pending' && (
                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[#ECC6C0] bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] hover:bg-[var(--accent-danger)] hover:text-white transition-colors cursor-pointer"
                  >
                    Batalkan Booking
                  </button>
                )}

                {booking.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => router.push(`/kos/${booking.kos.id}/view`)}
                    className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-spark)] text-white hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Beri Review Kos
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
                >
                  Cetak Ringkasan
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
