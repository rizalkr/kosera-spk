'use client';

import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useEditKos } from '@/hooks/seller/kos/useEditKos';
import { EditKosForm } from '@/components/features/seller/kos/edit/organisms/EditKosForm';
import { KECAMATAN_SEMARANG, FACILITIES } from '@/lib/constants';

function EditKosPage() {
  const {
    kosId,
    formData,
    errors,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useEditKos();

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 animate-pulse space-y-6">
              <div className="h-8 bg-[var(--bg-muted)] rounded w-64" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3.5 bg-[var(--bg-muted)] rounded w-32" />
                    <div className="h-10 bg-[var(--bg-muted)] rounded-[10px]" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['SELLER']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)]">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div>
            <button
              type="button"
              onClick={() => window.location.assign(`/seller/kos/${kosId}`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] mb-3 transition-colors cursor-pointer"
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
              <span>Kembali ke Detail Kos</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
              Edit Kos
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Perbarui informasi kos Anda agar selalu akurat untuk calon penyewa.
            </p>
          </div>

          {errors.general && (
            <div className="bg-[var(--accent-danger-tint)] border border-[#ECC6C0] rounded-[14px] p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[var(--accent-danger)] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-[var(--accent-danger)]">
                  Terjadi Kesalahan
                </h3>
                <p className="text-xs text-[var(--ink-primary)] mt-0.5">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] overflow-hidden">
            <EditKosForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              isSubmitting={isSubmitting}
              cities={['Semua Kecamatan', ...KECAMATAN_SEMARANG]}
              facilitiesOptions={[...FACILITIES]}
            />
          </div>

          <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-6">
            <h3 className="text-base font-bold text-[var(--ink-primary)] mb-3">
              Panduan Pembaruan Data Kos
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink-secondary)]">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] mt-2 shrink-0" />
                <span>Pastikan informasi harga, fasilitas, dan aturan kos selalu terbaru.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] mt-2 shrink-0" />
                <span>Perbarui jumlah kamar terisi secara berkala demi transparansi ketersediaan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] mt-2 shrink-0" />
                <span>Jika alamat berubah, perbarui koordinat agar pin peta dan skor jarak tetap akurat.</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default EditKosPage;
