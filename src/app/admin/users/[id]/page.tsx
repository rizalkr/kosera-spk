'use client';

import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useAdminUser } from '@/hooks/admin/useAdminUser';
import { showConfirm, showSuccess, showError } from '@/lib/sweetalert';
import { UserLoadingState } from '@/components/features/admin/users/organisms/UserLoadingState';
import { UserErrorState } from '@/components/features/admin/users/organisms/UserErrorState';
import { UserDetailCard } from '@/components/features/admin/users/organisms/UserDetailCard';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { user, loading, error, refetch, deleteUser, deleting } = useAdminUser(userId);

  const handleDeleteUser = async () => {
    if (!user) return;
    const result = await showConfirm(
      `User "${user.name}" akan dihapus dan dipindahkan ke arsip. Aksi ini dapat dibatalkan dengan memulihkan user dari arsip.`,
      'Hapus User?',
      'Ya, Hapus',
      'Batal'
    );
    if (!result.isConfirmed) return;
    const ok = await deleteUser();
    if (ok) {
      await showSuccess('User berhasil dihapus dan dipindahkan ke arsip');
      router.push('/admin/users');
    } else {
      await showError('Gagal menghapus user');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
        <UserLoadingState />
      </ProtectedRoute>
    );
  }

  if (error || !user) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
        <UserErrorState error={error} onRetry={refetch} onBack={() => router.push('/admin/users')} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-5 border-b border-[var(--border-stone)]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Detail User
              </h1>
              <p className="text-sm text-[var(--ink-secondary)] mt-1">
                Informasi lengkap user <span className="font-mono-tabular">#{user.id}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Edit User
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
          <UserDetailCard
            user={user}
            onEdit={() => router.push(`/admin/users/${user.id}/edit`)}
            onDelete={handleDeleteUser}
            onBack={() => router.push('/admin/users')}
            deleting={deleting}
          />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default UserDetailPage;
