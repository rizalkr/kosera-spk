'use client';

import { useEffect, useState } from 'react';
import { useCreateBooking } from '@/hooks/useApi';
import { showCustomAlert, showError } from '@/lib/sweetalert';
import { formatRupiah } from '@/lib/utils/discovery';
import type { PublicKosData } from '@/types/kos';

interface BookingModalProps {
  kos: PublicKosData;
  isOpen: boolean;
  initialDuration?: number;
  onClose: () => void;
  onBookingCreated?: () => void;
}

interface BookingDetails {
  startDate: string;
  duration: number;
  notes: string;
  contactMethod: 'whatsapp' | 'phone';
}

export default function BookingModal({
  kos,
  isOpen,
  initialDuration = 1,
  onClose,
  onBookingCreated,
}: BookingModalProps) {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    startDate: '',
    duration: initialDuration,
    notes: '',
    contactMethod: 'whatsapp',
  });

  const [shouldRedirectOnReturn, setShouldRedirectOnReturn] = useState(false);
  const createBookingMutation = useCreateBooking();

  useEffect(() => {
    if (isOpen) {
      setBookingDetails((prev) => ({
        ...prev,
        duration: initialDuration,
      }));
    }
  }, [isOpen, initialDuration]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && shouldRedirectOnReturn) {
        setShouldRedirectOnReturn(false);

        setTimeout(async () => {
          const result = await showCustomAlert(
            `
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-2">Selamat datang kembali</h3>
              <p class="mb-4">Booking Anda sudah berhasil dibuat dengan status PENDING.</p>
              <p>Apakah Anda ingin melihat detail booking di dashboard?</p>
            </div>
          `,
            '',
            'success'
          );

          if (result.isConfirmed) {
            window.location.href = '/renter/bookings';
          }
        }, 1000);
      }
    };

    if (shouldRedirectOnReturn) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldRedirectOnReturn]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = new Date(bookingDetails.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + bookingDetails.duration);

    const totalPrice = kos.price * bookingDetails.duration;

    try {
      const bookingData = {
        kosId: kos.id,
        checkInDate: bookingDetails.startDate,
        duration: bookingDetails.duration,
        notes: bookingDetails.notes || undefined,
      };

      await createBookingMutation.mutateAsync(bookingData);

      if (onBookingCreated) {
        onBookingCreated();
      }

      if (bookingDetails.contactMethod === 'whatsapp') {
        const message = `Halo, saya tertarik untuk booking kos:

*${kos.name}*
Alamat: ${kos.address}, ${kos.city}
Harga: Rp ${kos.price.toLocaleString()}/bulan

*Detail Booking:*
Tanggal Mulai: ${startDate.toLocaleDateString('id-ID')}
Tanggal Berakhir: ${endDate.toLocaleDateString('id-ID')}
Durasi: ${bookingDetails.duration} bulan
Total Biaya: Rp ${totalPrice.toLocaleString()}

${bookingDetails.notes ? `*Catatan:*\n${bookingDetails.notes}` : ''}

Mohon informasi lebih lanjut untuk proses booking. Booking sudah dibuat di sistem dengan status pending. Terima kasih!`;

        let ownerPhone = kos.owner?.contact || '6281234567890';
        if (ownerPhone.startsWith('0')) {
          ownerPhone = '62' + ownerPhone.substring(1);
        } else if (!ownerPhone.startsWith('62')) {
          ownerPhone = '62' + ownerPhone;
        }

        const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, '_blank');

        setShouldRedirectOnReturn(true);
        onClose();

        setTimeout(async () => {
          if (shouldRedirectOnReturn) {
            setShouldRedirectOnReturn(false);
            const result = await showCustomAlert(
              `
              <div class="text-center">
                <h3 class="text-lg font-semibold mb-2">Booking berhasil dibuat (PENDING)</h3>
                <p class="mb-4">WhatsApp sudah terbuka di tab baru untuk menghubungi pemilik kos.</p>
                <p>Apakah Anda ingin melihat booking Anda di dashboard?</p>
              </div>
            `,
              '',
              'success'
            );

            if (result.isConfirmed) {
              window.location.href = '/renter/bookings';
            }
          }
        }, 5000);

        return;
      } else {
        const ownerPhone = kos.owner?.contact || '081234567890';
        window.open(`tel:${ownerPhone}`, '_self');
        onClose();

        setTimeout(async () => {
          const result = await showCustomAlert(
            `
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-2">Booking berhasil dibuat (PENDING)</h3>
              <p class="mb-2">Panggilan telepon akan tersambung ke pemilik kos.</p>
              <div class="text-left bg-gray-50 p-3 rounded-lg mb-4">
                <strong>Detail Booking:</strong><br>
                Kos: ${kos.name}<br>
                Tanggal Mulai: ${startDate.toLocaleDateString('id-ID')}<br>
                Durasi: ${bookingDetails.duration} bulan<br>
                Total: Rp ${totalPrice.toLocaleString()}
              </div>
              <p>Apakah Anda ingin melihat booking Anda di dashboard?</p>
            </div>
          `,
            '',
            'success'
          );

          if (result.isConfirmed) {
            window.location.href = '/renter/bookings';
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      showError(
        'Gagal membuat booking. Silakan coba lagi. Error: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const totalPrice = kos.price * bookingDetails.duration;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 bg-[#181A18]/45 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        style={{ boxShadow: 'var(--shadow-float)' }}
        className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-stone)] flex items-center justify-between gap-4">
          <div>
            <h2
              id="booking-modal-title"
              className="text-xl sm:text-2xl font-bold text-[var(--ink-primary)] tracking-[-0.02em]"
            >
              Ajukan Booking Kos
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-0.5">
              Lengkapi tanggal masuk dan durasi sewa untuk diteruskan ke
              pemilik kos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog booking"
            className="w-9 h-9 rounded-[10px] border border-[var(--border-stone)] flex items-center justify-center text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-canvas)] cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Kos Summary */}
          <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-[var(--ink-primary)]">
                  {kos.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                  {kos.address}, {kos.city}
                </p>
              </div>
              <div className="font-mono-tabular text-base font-bold text-[var(--accent-primary)]">
                {formatRupiah(kos.price)}/bln
              </div>
            </div>
            {kos.owner && (
              <div className="text-xs text-[var(--ink-secondary)] pt-1 border-t border-[var(--border-stone)]">
                Pemilik:{' '}
                <span className="font-semibold text-[var(--ink-primary)]">
                  {kos.owner.fullName}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="booking-start-date"
                  className="block text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mb-1.5"
                >
                  Tanggal Mulai Sewa
                </label>
                <input
                  id="booking-start-date"
                  type="date"
                  min={minDate}
                  value={bookingDetails.startDate}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      startDate: e.target.value,
                    })
                  }
                  className="font-mono-tabular w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-sm text-[var(--ink-primary)] focus:bg-[var(--bg-surface)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="booking-duration"
                  className="block text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mb-1.5"
                >
                  Durasi Sewa
                </label>
                <select
                  id="booking-duration"
                  value={bookingDetails.duration}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      duration: parseInt(e.target.value, 10),
                    })
                  }
                  className="font-mono-tabular w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-sm text-[var(--ink-primary)] focus:bg-[var(--bg-surface)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 cursor-pointer"
                  required
                >
                  <option value={1}>1 Bulan</option>
                  <option value={2}>2 Bulan</option>
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={12}>12 Bulan</option>
                </select>
              </div>
            </div>

            {/* Contact Method Radio Cards */}
            <div>
              <span className="block text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mb-2">
                Metode Hubungi Pemilik
              </span>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'phone', label: 'Telepon' },
                  ] as const
                ).map((method) => {
                  const selected =
                    bookingDetails.contactMethod === method.value;
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-[10px] border text-sm font-medium cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[var(--accent-tint)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                          : 'bg-[var(--bg-canvas)] border-[var(--border-stone)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value={method.value}
                        checked={selected}
                        onChange={(e) =>
                          setBookingDetails({
                            ...bookingDetails,
                            contactMethod: e.target.value as
                              | 'whatsapp'
                              | 'phone',
                          })
                        }
                        className="accent-[var(--accent-primary)]"
                      />
                      <span>{method.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="booking-notes"
                className="block text-xs sm:text-sm font-semibold text-[var(--ink-primary)] mb-1.5"
              >
                Catatan (Opsional)
              </label>
              <textarea
                id="booking-notes"
                value={bookingDetails.notes}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    notes: e.target.value,
                  })
                }
                rows={3}
                placeholder="Tambahkan catatan atau pertanyaan khusus..."
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/75 focus:bg-[var(--bg-surface)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20"
              />
            </div>

            {/* Price Summary */}
            <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4 space-y-2.5">
              <h4 className="text-sm font-bold text-[var(--ink-primary)]">
                Ringkasan Biaya
              </h4>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--ink-secondary)]">
                    Harga per bulan
                  </span>
                  <span className="font-mono-tabular font-medium text-[var(--ink-primary)]">
                    {formatRupiah(kos.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-secondary)]">Durasi</span>
                  <span className="font-mono-tabular font-medium text-[var(--ink-primary)]">
                    {bookingDetails.duration} bulan
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--border-stone)] flex justify-between items-baseline">
                  <span className="font-bold text-[var(--ink-primary)]">
                    Total Estimasi
                  </span>
                  <span className="font-mono-tabular text-lg font-bold text-[var(--accent-primary)]">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={createBookingMutation.isPending}
                className="flex-1 py-2.5 px-4 rounded-[10px] text-sm font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={
                  !bookingDetails.startDate || createBookingMutation.isPending
                }
                className="flex-1 py-2.5 px-4 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                {createBookingMutation.isPending
                  ? 'Membuat Booking...'
                  : bookingDetails.contactMethod === 'whatsapp'
                    ? 'Lanjut via WhatsApp'
                    : 'Hubungi via Telepon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
