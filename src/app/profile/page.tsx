'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { LoginRequired } from '@/components/auth/LoginRequired';
import UpdatePasswordModal from '@/components/modals/UpdatePasswordModal';
import { showSuccess } from '@/lib/sweetalert';

interface ProfileMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const StarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
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
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4 text-[var(--ink-secondary)] group-hover:text-[var(--accent-primary)] transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-[var(--ink-primary)] text-white border-[var(--ink-primary)]';
    case 'SELLER':
      return 'bg-[var(--accent-spark-tint)] text-[#9A471F] border-[#F2CDBB]';
    case 'RENTER':
      return 'bg-[var(--accent-tint)] text-[var(--accent-primary)] border-[#BBDCD0]';
    default:
      return 'bg-[var(--bg-muted)] text-[var(--ink-secondary)] border-[var(--border-stone)]';
  }
};

const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'SELLER':
      return 'Pemilik Kos';
    case 'RENTER':
      return 'Pencari Kos';
    default:
      return role;
  }
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems: ProfileMenuItem[] = [
    {
      label: 'Preferensi Pencarian',
      href: '/profile/preferences',
      icon: <SettingsIcon />,
      description: 'Atur kriteria budget, lokasi, fasilitas, dan bobot SPK',
    },
    {
      label: 'Rekomendasi Kos',
      href: '/recommendations',
      icon: <StarIcon />,
      description: 'Lihat peringkat kos yang cocok dengan profil Anda',
    },
    {
      label: 'Favorit Saya',
      href: '/favorites',
      icon: <HeartIcon />,
      description: 'Tinjau daftar kos yang sudah Anda simpan',
    },
    {
      label: 'Booking Saya',
      href: '/renter/bookings',
      icon: <CalendarIcon />,
      description: 'Pantau status konfirmasi dan riwayat pengajuan sewa',
    },
  ];

  const visibleMenuItems = user?.role === 'RENTER' ? menuItems : [];
  const initials = (user?.username?.slice(0, 2) || 'KS').toUpperCase();

  return (
    <LoginRequired>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
          {/* Profile Header Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] overflow-hidden">
            {/* Architectural Warm Tactile Tone-Step Cover */}
            <div className="h-28 bg-[var(--bg-muted)] border-b border-[var(--border-stone)] relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-2/5 bg-[var(--accent-tint)]/75 -skew-x-12 translate-x-10"
              />
            </div>

            <div className="relative px-6 pb-6">
              <div className="absolute -top-14 left-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--bg-surface)] bg-[var(--accent-primary)] flex items-center justify-center shadow-sm">
                  {avatarFailed ? (
                    <span className="font-mono-tabular text-2xl font-bold text-white">
                      {initials}
                    </span>
                  ) : (
                    <Image
                      src="/images/profile.jpg"
                      alt={`Foto profil ${user?.username || 'pengguna'}`}
                      fill
                      className="object-cover"
                      onError={() => setAvatarFailed(true)}
                    />
                  )}
                </div>
              </div>

              <div className="pt-16 sm:pt-4 sm:pl-34">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--ink-primary)] tracking-tight">
                      {user?.username}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2.5 mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                          user?.role || ''
                        )}`}
                      >
                        {getRoleDisplayName(user?.role || '')}
                      </span>
                      <span className="font-mono-tabular text-xs font-medium text-[var(--ink-secondary)]">
                        ID: #{user?.userId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Section for RENTER */}
          {visibleMenuItems.length > 0 && (
            <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-stone)] bg-[var(--bg-canvas)]/50">
                <h2 className="text-base font-semibold text-[var(--ink-primary)] flex items-center gap-2">
                  <span className="text-[var(--accent-primary)]">
                    <UserIcon />
                  </span>
                  <span>Navigasi Pencari Kos</span>
                </h2>
              </div>
              <div className="divide-y divide-[var(--border-stone)]">
                {visibleMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-canvas)] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-[var(--accent-tint)] text-[var(--accent-primary)] shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-xs text-[var(--ink-secondary)] mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Actions Section */}
          <section className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-stone)] bg-[var(--bg-canvas)]/50">
              <h2 className="text-base font-semibold text-[var(--ink-primary)] flex items-center gap-2">
                <span className="text-[var(--accent-primary)]">
                  <LockIcon />
                </span>
                <span>Keamanan &amp; Aksi</span>
              </h2>
            </div>
            <div className="divide-y divide-[var(--border-stone)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-canvas)] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-[var(--accent-tint)] text-[var(--accent-primary)] shrink-0">
                    <LockIcon />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ink-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      Ubah Kata Sandi
                    </h3>
                    <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                      Perbarui kata sandi akun Anda secara berkala
                    </p>
                  </div>
                </div>
                <ArrowRightIcon />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="group w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--accent-danger-tint)] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-[var(--accent-danger-tint)] text-[var(--accent-danger)] shrink-0">
                    <LogoutIcon />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--accent-danger)]">
                      Keluar
                    </h3>
                    <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                      Akhiri sesi Anda pada perangkat ini
                    </p>
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-[var(--accent-danger)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {isModalOpen && (
        <UpdatePasswordModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            showSuccess('Kata sandi berhasil diperbarui!');
          }}
        />
      )}
    </LoginRequired>
  );
}
