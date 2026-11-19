import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-stone)] text-[var(--ink-secondary)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-bold tracking-[-0.03em] text-[var(--ink-primary)]"
          >
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-[3px] bg-[var(--accent-primary)] inline-block"
            />
            <span>KOSERA</span>
          </Link>
          <p className="text-xs text-[var(--ink-secondary)]">
            Platform pencarian dan pencocokan kos di Semarang.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium"
        >
          <Link
            href="/"
            className="hover:text-[var(--ink-primary)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/list"
            className="hover:text-[var(--ink-primary)] transition-colors"
          >
            Daftar
          </Link>
          <Link
            href="/contact"
            className="hover:text-[var(--ink-primary)] transition-colors"
          >
            Kontak
          </Link>
          <Link
            href="/bookings"
            className="hover:text-[var(--ink-primary)] transition-colors"
          >
            Bookings
          </Link>
          <Link
            href="/complaint"
            className="hover:text-[var(--ink-primary)] transition-colors"
          >
            Aduan
          </Link>
          <Link
            href="/profile"
            className="hover:text-[var(--ink-primary)] transition-colors"
          >
            Profil
          </Link>
        </nav>

        <div className="text-xs text-[var(--ink-secondary)]">
          &copy; {new Date().getFullYear()} Kosera. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
