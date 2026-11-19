'use client';

import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { useAdminUser } from '@/hooks/admin/useAdminUser';
import { UserLoadingState } from '@/components/features/admin/users/organisms/UserLoadingState';
import { UserErrorState } from '@/components/features/admin/users/organisms/UserErrorState';
import { UserEditForm } from '@/components/features/admin/users/molecules/UserEditForm';
import { showSuccess } from '@/lib/sweetalert';

function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { user, loading, error, refetch } = useAdminUser(userId);

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
                Edit User
              </h1>
              <p className="text-sm text-[var(--ink-secondary)] mt-1">
                Perbarui informasi user {user.name}{' '}
                <span className="font-mono-tabular">(#{user.id})</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/admin/users/${user.id}`)}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
            >
              Kembali ke Detail
            </button>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8">
            <UserEditForm
              user={user}
              onSuccess={async (u) => {
                await showSuccess('User berhasil diperbarui');
                router.push(`/admin/users/${u.id}`);
              }}
              onCancel={() => router.push(`/admin/users/${user.id}`)}
            />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EditUserPage;

