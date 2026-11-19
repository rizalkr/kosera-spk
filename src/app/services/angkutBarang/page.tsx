import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const HIGHLIGHTS = [
  {
    title: 'Armada Dalam Kota Semarang',
    description:
      'Pilihan mobil pikap dan van untuk pindahan kamar kos maupun apartemen mahasiswa di area Tembalang, Pedurungan, hingga Semarang Tengah.',
  },
  {
    title: 'Jadwal Penjemputan Fleksibel',
    description:
      'Atur slot waktu pindahan menyesuaikan jam check-in kos tujuan agar barang langsung tertata di hari yang sama.',
  },
  {
    title: 'Estimasi Tarif Transparan',
    description:
      'Rincian biaya dihitung berdasarkan jarak tempuh dan jumlah muatan tanpa biaya tambahan tersembunyi.',
  },
] as const;

export default function AngkutBarangPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-7 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-tint)] border border-[#BBDCD0] text-xs font-semibold text-[var(--accent-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span>Segera Hadir · Layanan Pindahan</span>
            </span>
            <Link
              href="/list"
              className="text-xs font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Jelajahi Kos Semarang
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="h-16 w-16 rounded-[16px] bg-[var(--accent-tint)] border border-[#BBDCD0] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Layanan Angkut Barang Kosera
              </h1>
              <p className="text-sm sm:text-base text-[var(--ink-secondary)] leading-relaxed">
                Fitur <span className="font-semibold text-[var(--ink-primary)]">Angkut Barang</span>{' '}
                sedang disiapkan untuk membantu pindahan antar kos di Semarang dengan armada yang terjadwal dan tarif yang jelas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Hubungi Tim Kami
            </Link>
            <Link
              href="/list"
              className="inline-flex items-center px-5 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors"
            >
              Cari Kos di Semarang
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-5 space-y-2"
            >
              <h2 className="text-sm font-bold text-[var(--ink-primary)]">{item.title}</h2>
              <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
