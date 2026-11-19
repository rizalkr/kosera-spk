'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface LoginRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showModal?: boolean;
}

const LockBadgeIcon = () => (
  <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] flex items-center justify-center">
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  </div>
);

export const LoginRequired = ({
  children,
  fallback,
  redirectTo = '/auth/login',
  showModal = false,
}: LoginRequiredProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectInitiated, setRedirectInitiated] = useState(false);

  // Open modal automatically if requested and user not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && showModal) {
      setShowLoginModal(true);
    }
  }, [isLoading, isAuthenticated, showModal]);

  // Handle redirect AFTER render to avoid updating Router during render
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !showModal && !fallback && !redirectInitiated) {
      const currentPath = window.location.pathname + window.location.search;
      setRedirectInitiated(true);
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoading, isAuthenticated, showModal, fallback, redirectTo, router, redirectInitiated]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center p-4">
        <div
          role="status"
          aria-live="polite"
          className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-7 py-5 flex items-center gap-3"
        >
          <div className="h-5 w-5 rounded-full border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] animate-spin" />
          <span className="text-sm font-medium text-[var(--ink-secondary)]">Memuat sesi...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showModal) {
      return (
        <>
          {fallback}
          {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </>
      );
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    if (redirectInitiated) {
      return (
        <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center px-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 max-w-sm w-full text-center space-y-3">
            <LockBadgeIcon />
            <h2 className="text-lg font-semibold text-[var(--ink-primary)]">Login Diperlukan</h2>
            <p className="text-sm text-[var(--ink-secondary)]">Mengalihkan ke halaman masuk...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex items-center justify-center px-4">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 max-w-sm w-full text-center space-y-3">
          <LockBadgeIcon />
          <h2 className="text-lg font-semibold text-[var(--ink-primary)]">Login Diperlukan</h2>
          <p className="text-sm text-[var(--ink-secondary)]">Mengalihkan ke halaman masuk...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-modal-title"
      onClick={onClose}
      className="fixed inset-0 bg-[var(--ink-primary)]/45 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-7 max-w-md w-full shadow-[var(--shadow-float)]"
      >
        <div className="text-center space-y-4">
          <LockBadgeIcon />
          <div className="space-y-1.5">
            <h3
              id="login-required-modal-title"
              className="text-lg font-semibold text-[var(--ink-primary)]"
            >
              Login Diperlukan
            </h3>
            <p className="text-sm text-[var(--ink-secondary)]">
              Anda perlu masuk ke akun Kosera untuk menggunakan fitur ini.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-[10px] text-sm font-medium border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push('/auth/login');
              }}
              className="flex-1 px-4 py-2.5 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
