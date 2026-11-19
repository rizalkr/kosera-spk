'use client';

import { useMemo, useState } from 'react';
import { useAdminBooking } from '@/hooks/admin/useAdminBooking';
import { useDebounce } from '@/hooks/useDebounce';
import { AdminBookingStatus, useAdminUpdateBookingStatus } from '@/hooks/admin/useAdminUpdateBookingStatus';
import { BookingStatusDropdown } from '@/components/features/dashboard/bookings/BookingStatusDropdown';
import { clsx } from 'clsx';
import { showError, showConfirm, showToast } from '@/lib/sweetalert';
import type { AdminBookingData } from '@/types';
import { BookingHistoryModal } from '@/components/modals/BookingHistoryModal';
import { useAdminBookingHistory } from '@/hooks/admin/useAdminBookingHistory';


export default function BookingAdminClient() {
  const [status, setStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedStatus = useDebounce(status, 300);
  const debouncedStartDate = useDebounce(startDate, 300);
  const debouncedEndDate = useDebounce(endDate, 300);

  const bookingFilters = useMemo(() => ({
    page: currentPage,
    limit: bookingsPerPage,
    status: debouncedStatus !== 'all' ? debouncedStatus : undefined,
    startDate: debouncedStartDate || undefined,
    endDate: debouncedEndDate || undefined,
    searchQuery: debouncedSearchQuery || undefined,
  }), [currentPage, bookingsPerPage, debouncedStatus, debouncedStartDate, debouncedEndDate, debouncedSearchQuery]);

  const { data: bookings, loading, error, pagination, refetch } = useAdminBooking(bookingFilters);

  // Using unified API client
  const { trigger: updateStatus, isMutating } = useAdminUpdateBookingStatus();

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'status') setStatus(value);
    if (type === 'search') setSearchQuery(value);
    if (type === 'startDate') setStartDate(value);
    if (type === 'endDate') setEndDate(value);
    setCurrentPage(1);
  };

  // 2. Buat satu fungsi handler untuk dipanggil di dalam loop
  const handleStatusChange = async (bookingId: number, newStatus: AdminBookingStatus) => {
    // Tampilkan dialog konfirmasi
    const confirmation = await showConfirm(
      `Anda akan mengubah status booking #${bookingId} menjadi "${newStatus}". Lanjutkan?`,
      'Konfirmasi Perubahan Status'
    );

    // Batalkan jika admin tidak menekan "Ya"
    if (!confirmation.isConfirmed) {
      return;
    }

    setUpdatingId(bookingId);
    try {
      // Using unified API client
      await updateStatus({
        bookingId: bookingId,
        status: newStatus,
      });

      // Tampilkan notifikasi toast jika berhasil
      showToast('Status booking berhasil diperbarui', 'success');
      
      refetch(); // Muat ulang data tabel
    } catch (err) {
      // Tampilkan notifikasi error jika gagal
      const errorMessage = (err as Error).message || 'Terjadi kesalahan tidak diketahui.';
      showError(`Gagal memperbarui status: ${errorMessage}`);
      console.error("Gagal update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // History modal state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const history = useAdminBookingHistory();

  const openHistory = async (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setHistoryOpen(true);
    await history.fetch(bookingId);
  };

  const closeHistory = () => {
    setHistoryOpen(false);
    setSelectedBookingId(null);
    history.reset();
  };

  const inputClass =
    'w-full px-3 py-2 text-xs sm:text-sm bg-[var(--bg-canvas)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-colors';

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--border-stone)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
            Kelola Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-0.5">
            Pantau dan perbarui status seluruh pengajuan sewa kamar di platform Kosera.
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--ink-secondary)]">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)]" />
            <span>Memperbarui...</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
            Pencarian
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={inputClass}
            placeholder="Cari penyewa atau kos..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={inputClass}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className={`${inputClass} font-mono-tabular`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className={`${inputClass} font-mono-tabular`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 space-y-3">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] mx-auto" />
            <div className="text-xs sm:text-sm text-[var(--ink-secondary)]">
              Memuat data booking...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-sm font-semibold text-[var(--accent-danger)]">
              Gagal memuat bookings
            </div>
            <div className="text-xs text-[var(--ink-secondary)]">{error}</div>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 space-y-1.5">
            <div className="text-sm font-semibold text-[var(--ink-primary)]">
              Tidak ada booking ditemukan
            </div>
            <div className="text-xs text-[var(--ink-secondary)]">
              Coba ubah filter pencarian atau rentang tanggal.
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 px-4 py-3 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[12px] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink-secondary)]">
              <div>
                Menampilkan <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">{bookings.length}</span> dari{' '}
                <span className="font-mono-tabular font-semibold text-[var(--ink-primary)]">{pagination.totalCount}</span> booking
              </div>
              <div className="font-mono-tabular">
                Halaman {pagination.currentPage} / {pagination.totalPages}
              </div>
            </div>

            <table className="min-w-full divide-y divide-[var(--border-stone)]">
              <thead className="bg-[var(--bg-canvas)]">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Property</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Check-In</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Check-Out</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Total Price</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--ink-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-surface)] divide-y divide-[var(--border-stone)]">
                {bookings.map((booking: AdminBookingData) => (
                  <tr key={booking.id} className="hover:bg-[var(--bg-canvas)]/70 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono-tabular text-xs font-semibold text-[var(--ink-primary)]">
                      #{booking.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)]">
                        {booking.user.name}
                      </div>
                      <div className="text-[11px] text-[var(--ink-secondary)]">
                        @{booking.user.username}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs sm:text-sm font-semibold text-[var(--ink-primary)]">
                        {booking.kos.name}
                      </div>
                      <div className="text-[11px] text-[var(--ink-secondary)]">
                        {booking.kos.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            'inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full border',
                            booking.status === 'pending'
                              ? 'bg-[var(--accent-spark-tint)] text-[#9A471F] border-[#F2CDBB]'
                              : booking.status === 'confirmed'
                                ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[#BBDCD0]'
                                : booking.status === 'cancelled'
                                  ? 'bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] border-[#ECC6C0]'
                                  : 'bg-[var(--bg-muted)] text-[var(--ink-primary)] border-[var(--border-stone)]'
                          )}
                        >
                          {booking.status}
                        </span>
                        <BookingStatusDropdown
                          value={booking.status as AdminBookingStatus}
                          onChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                          disabled={isMutating && updatingId === booking.id}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono-tabular text-xs text-[var(--ink-primary)]">
                      {booking.checkInDate}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono-tabular text-xs text-[var(--ink-primary)]">
                      {booking.checkOutDate}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono-tabular text-xs font-bold text-[var(--accent-primary)]">
                      Rp {booking.totalPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono-tabular text-[11px] text-[var(--ink-secondary)]">
                      {booking.createdAt}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                      <button
                        type="button"
                        onClick={() => openHistory(booking.id)}
                        className="px-3 py-1.5 border border-[var(--border-stone)] bg-[var(--bg-canvas)] rounded-[8px] font-semibold text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                      >
                        Riwayat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-stone)]">
          <div className="font-mono-tabular text-xs text-[var(--ink-secondary)]">
            Halaman {pagination.currentPage} dari {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 border border-[var(--border-stone)] bg-[var(--bg-canvas)] rounded-[8px] text-xs font-semibold text-[var(--ink-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--ink-secondary)] cursor-pointer"
            >
              Prev
            </button>
            <span className="font-mono-tabular px-3 py-1.5 bg-[var(--accent-tint)] text-[var(--accent-primary)] rounded-[8px] text-xs font-bold">
              {pagination.currentPage}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 border border-[var(--border-stone)] bg-[var(--bg-canvas)] rounded-[8px] text-xs font-semibold text-[var(--ink-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--ink-secondary)] cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <BookingHistoryModal
        isOpen={historyOpen}
        onClose={closeHistory}
        bookingId={selectedBookingId}
        loading={history.loading}
        error={history.error}
        items={history.data}
      />
    </div>
  );
};