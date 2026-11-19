'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Role-based navigation links preserved for all existing user roles
  const getNavigationItems = () => {
    if (!user) return [];

    const items: Array<{ label: string; href: string }> = [];

    switch (user.role) {
      case 'ADMIN':
        items.push(
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Profil', href: '/profile' }
        );
        break;
      case 'SELLER':
        items.push(
          { label: 'Dashboard', href: '/seller/dashboard' },
          { label: 'Profil', href: '/profile' }
        );
        break;
      case 'RENTER':
        items.push(
          { label: 'Rekomendasi', href: '/recommendations' },
          { label: 'Bookings', href: '/bookings' },
          { label: 'Favorit', href: '/favorites' },
          { label: 'Profil', href: '/profile' }
        );
        break;
    }

    return items;
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  };

  const isServicesActive =
    pathname?.startsWith('/services/') ?? false;

  const navLinkClass = (active: boolean) =>
    `px-3 py-1.5 rounded-[10px] text-sm transition-colors whitespace-nowrap ${
      active
        ? 'bg-[var(--bg-muted)] text-[var(--ink-primary)] font-semibold'
        : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-muted)]/60 font-medium'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-[var(--bg-canvas)]/95 backdrop-blur-sm border-b border-[var(--border-stone)] transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_4px_20px_-12px_rgba(24,26,24,0.12)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 relative">
        {/* Left: Brand Wordmark */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl font-bold tracking-[-0.03em] text-[var(--ink-primary)] shrink-0"
        >
          <span
            aria-hidden="true"
            className="w-2.5 h-2.5 rounded-[3px] bg-[var(--accent-primary)] inline-block"
          />
          <span>KOSERA</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-1"
        >
          <Link href="/" className={navLinkClass(isActive('/'))}>
            Home
          </Link>
          <Link href="/list" className={navLinkClass(isActive('/list'))}>
            List Kos
          </Link>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              className={`${navLinkClass(isServicesActive)} inline-flex items-center gap-1 cursor-pointer`}
            >
              <span>Services</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              role="menu"
              style={{ boxShadow: 'var(--shadow-float)' }}
              className={`spring-transition absolute left-0 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] p-1.5 z-50 origin-top ${
                servicesOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
              }`}
            >
              <Link
                href="/services/angkutBarang"
                role="menuitem"
                onClick={() => setServicesOpen(false)}
                className={`block px-3 py-2 rounded-[10px] text-sm transition-colors ${
                  isActive('/services/angkutBarang')
                    ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--ink-primary)] hover:bg-[var(--bg-canvas)]'
                }`}
              >
                Angkut Barang
              </Link>
              <Link
                href="/services/titipBarang"
                role="menuitem"
                onClick={() => setServicesOpen(false)}
                className={`block px-3 py-2 rounded-[10px] text-sm transition-colors ${
                  isActive('/services/titipBarang')
                    ? 'bg-[var(--accent-tint)] text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--ink-primary)] hover:bg-[var(--bg-canvas)]'
                }`}
              >
                Titip Barang
              </Link>
            </div>
          </div>

          {isAuthenticated &&
            getNavigationItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Right: Desktop Auth Actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {isLoading ? (
            <div
              className="h-9 w-24 rounded-[10px] bg-[var(--bg-muted)] animate-pulse"
              aria-label="Memuat status akun"
            />
          ) : isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger-tint)] transition-colors cursor-pointer"
            >
              Keluar
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="lg:hidden w-10 h-10 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--ink-primary)] cursor-pointer"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
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
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{ boxShadow: 'var(--shadow-float)' }}
          className="lg:hidden bg-[var(--bg-surface)] border-t border-[var(--border-stone)] px-4 py-4 space-y-2"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-[10px] text-sm ${
              isActive('/')
                ? 'bg-[var(--bg-muted)] text-[var(--ink-primary)] font-semibold'
                : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--ink-primary)]'
            }`}
          >
            Home
          </Link>
          <Link
            href="/list"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-[10px] text-sm ${
              isActive('/list')
                ? 'bg-[var(--bg-muted)] text-[var(--ink-primary)] font-semibold'
                : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--ink-primary)]'
            }`}
          >
            List Kos
          </Link>

          {/* Mobile Services */}
          <div className="rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] overflow-hidden">
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              className="w-full px-3 py-2.5 flex items-center justify-between text-sm font-medium text-[var(--ink-primary)] cursor-pointer"
            >
              <span>Services</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="px-2 pb-2 space-y-1 border-t border-[var(--border-stone)] pt-1.5">
                <Link
                  href="/services/angkutBarang"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setServicesOpen(false);
                  }}
                  className="block px-3 py-2 rounded-[8px] text-sm text-[var(--ink-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--ink-primary)]"
                >
                  Angkut Barang
                </Link>
                <Link
                  href="/services/titipBarang"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setServicesOpen(false);
                  }}
                  className="block px-3 py-2 rounded-[8px] text-sm text-[var(--ink-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--ink-primary)]"
                >
                  Titip Barang
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated &&
            getNavigationItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-[10px] text-sm ${
                  isActive(item.href)
                    ? 'bg-[var(--bg-muted)] text-[var(--ink-primary)] font-semibold'
                    : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-canvas)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {item.label}
              </Link>
            ))}

          <div className="pt-3 border-t border-[var(--border-stone)]">
            {isLoading ? (
              <div
                className="h-10 w-full rounded-[10px] bg-[var(--bg-muted)] animate-pulse"
                aria-label="Memuat status akun"
              />
            ) : isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-[10px] text-sm font-semibold border border-[var(--accent-danger)]/40 bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] cursor-pointer"
              >
                Keluar
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center rounded-[10px] text-sm font-semibold border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
