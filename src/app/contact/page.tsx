import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-7 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-[var(--border-stone)]">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-[var(--border-stone)] bg-[var(--bg-muted)] shrink-0">
              <Image
                src="/images/profile.jpg"
                alt="Foto profil Rizal Kurnia"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--accent-tint)] border border-[#BBDCD0] text-[11px] font-semibold text-[var(--accent-primary)]">
                Kontak &amp; Pengembang
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Rizal Kurnia
              </h1>
              <p className="text-sm text-[var(--ink-secondary)]">
                Mahasiswa Informatika · Universitas Semarang
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:rizalkurnia.me@gmail.com"
              className="group bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4 flex items-start gap-3.5 hover:border-[var(--accent-primary)] transition-colors"
            >
              <div className="h-9 w-9 rounded-[10px] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">Email</div>
                <div className="text-sm font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] truncate mt-0.5">
                  rizalkurnia.me@gmail.com
                </div>
              </div>
            </a>

            <a
              href="tel:085191294341"
              className="group bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px] p-4 flex items-start gap-3.5 hover:border-[var(--accent-primary)] transition-colors"
            >
              <div className="h-9 w-9 rounded-[10px] bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center shrink-0">
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">Telepon</div>
                <div className="font-mono-tabular text-sm font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] mt-0.5">
                  0851-9129-4341
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border-stone)]">
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://github.com/rizalkr"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rizal-kurnia-83709a366/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                LinkedIn
              </a>
            </div>

            <Link
              href="/complaint"
              className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Kirim Pengaduan
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
