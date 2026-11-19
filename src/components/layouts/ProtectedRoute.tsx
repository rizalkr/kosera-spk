'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('ADMIN' | 'SELLER' | 'RENTER')[];
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = ['ADMIN', 'SELLER', 'RENTER'],
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/auth/login?from=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, requireAuth, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center px-4">
        <div
          role="status"
          aria-live="polite"
          className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-8 py-6 flex flex-col items-center gap-3"
        >
          <div className="h-8 w-8 rounded-full border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] animate-spin" />
          <p className="text-sm font-medium text-[var(--ink-secondary)]">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
