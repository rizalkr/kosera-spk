'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import { LoginRequired } from '@/components/auth/LoginRequired';
import UpdatePasswordModal from '@/components/modals/UpdatePasswordModal';
import { showSuccess } from '@/lib/sweetalert';

/**
 * Profile menu item interface
 */
interface ProfileMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

/**
 * User icon component
 */
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

/**
 * Settings icon component
 */
const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/**
 * Star icon component for recommendations
 */
const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

/**
 * Lock icon component
 */
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

/**
 * Logout icon component
 */
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/**
 * Arrow right icon component
 */
const ArrowRightIcon = () => (
  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/**
 * Get role badge color based on user role
 */
const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'SELLER':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'RENTER':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

/**
 * Get role display name
 */
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

/**
 * ProfilePage Component
 * Enhanced profile page with better styling and navigation to preferences
 */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Menu items for profile page
  const menuItems: ProfileMenuItem[] = [
    {
      label: 'Preferensi Pencarian',
      href: '/profile/preferences',
      icon: <SettingsIcon />,
      description: 'Atur preferensi untuk mendapatkan rekomendasi kos terbaik',
    },
    {
      label: 'Rekomendasi Kos',
      href: '/recommendations',
      icon: <StarIcon />,
      description: 'Lihat kos yang sesuai dengan preferensi Anda',
    },
  ];

  // Filter menu items based on role (only RENTER can see preferences)
  const visibleMenuItems = user?.role === 'RENTER' ? menuItems : [];

  return (
    <LoginRequired>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            {/* Cover Image / Gradient */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500" />
            
            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="absolute -top-16 left-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src="/images/profile.jpg"
                    alt="Profile Picture"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=3b82f6&color=fff&size=128`;
                    }}
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="pt-20 sm:pt-4 sm:pl-40">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user?.role || '')}`}>
                        {getRoleDisplayName(user?.role || '')}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {user?.userId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Section for RENTER */}
          {visibleMenuItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserIcon />
                  Pengaturan Akun
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {visibleMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ArrowRightIcon />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <LockIcon />
                Keamanan & Aksi
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Change Password */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group w-full flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <LockIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Ubah Kata Sandi
                    </h3>
                    <p className="text-sm text-gray-500">Perbarui kata sandi akun Anda</p>
                  </div>
                </div>
                <ArrowRightIcon />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="group w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                    <LogoutIcon />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-600 group-hover:text-red-700 transition-colors">
                      Keluar
                    </h3>
                    <p className="text-sm text-gray-500">Keluar dari akun Anda</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Bergabung sejak 2024</p>
          </div>
        </div>
      </div>

      {/* Password Modal */}
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
