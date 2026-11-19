'use client';

import { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import { showSuccess, showError } from '@/lib/sweetalert';

interface UpdatePasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdatePasswordModal({ onClose, onSuccess }: UpdatePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Kata sandi baru dan konfirmasi tidak cocok.');
      showError('Kata sandi baru tidak cocok.', 'Validasi Gagal');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await userApi.updatePassword(currentPassword, newPassword);
      if (response.success) {
        await showSuccess('Kata sandi berhasil diperbarui!', 'Berhasil');
        onSuccess();
        onClose();
      } else {
        showError(response.message || 'Gagal memperbarui kata sandi.', 'Gagal Memperbarui');
      }
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      showError(apiErr.message || 'Terjadi kesalahan jaringan.', 'Kesalahan Jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[var(--bg-surface)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/25 focus:border-[var(--accent-primary)] transition-colors';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-password-title"
      onClick={onClose}
      className="fixed inset-0 bg-[var(--ink-primary)]/45 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] shadow-[var(--shadow-float)] p-6 sm:p-7 w-full max-w-md"
      >
        <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[var(--border-stone)]">
          <div>
            <h2 id="update-password-title" className="text-xl font-bold text-[var(--ink-primary)]">
              Ubah Kata Sandi
            </h2>
            <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
              Pastikan kata sandi baru mudah diingat namun aman.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="h-8 w-8 rounded-full border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-[10px] bg-[var(--accent-danger-tint)] border border-[#ECC6C0] text-xs font-medium text-[var(--accent-danger)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
            >
              Kata Sandi Saat Ini
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              placeholder="Masukkan kata sandi saat ini"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
            >
              Kata Sandi Baru
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
            >
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Ulangi kata sandi baru"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[10px] text-sm font-medium border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Memperbarui...' : 'Perbarui'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
