'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { showError, showSuccess } from '@/lib/sweetalert';
import { loginSchema, type LoginSchema } from '@/lib/validation/authSchemas';
import { z } from 'zod';
import clsx from 'clsx';

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

const TextInput = ({
  id,
  name,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  disabled,
  placeholder,
  error,
}: TextInputProps) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={clsx(
        'w-full px-3.5 py-2.5 text-sm bg-[var(--bg-surface)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 border rounded-[10px] focus:outline-none focus:ring-2 transition-colors',
        error
          ? 'border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/20'
          : 'border-[var(--border-stone)] focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]'
      )}
    />
    {error && <p className="mt-1 text-xs text-[var(--accent-danger)]">{error}</p>}
  </div>
);

interface PasswordInputProps extends Omit<TextInputProps, 'type'> {
  show: boolean;
  toggle: () => void;
}

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  show,
  toggle,
  error,
}: PasswordInputProps) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        autoComplete="current-password"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          'w-full px-3.5 py-2.5 pr-11 text-sm bg-[var(--bg-surface)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 border rounded-[10px] focus:outline-none focus:ring-2 transition-colors',
          error
            ? 'border-[var(--accent-danger)] focus:ring-[var(--accent-danger)]/20'
            : 'border-[var(--border-stone)] focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]'
        )}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors cursor-pointer"
      >
        {show ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
    {error && <p className="mt-1 text-xs text-[var(--accent-danger)]">{error}</p>}
  </div>
);

interface SubmitButtonProps {
  loading: boolean;
  idleLabel: string;
  loadingLabel: string;
}

const SubmitButton = ({ loading, idleLabel, loadingLabel }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 px-4 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        <span>{loadingLabel}</span>
      </div>
    ) : (
      idleLabel
    )}
  </button>
);

const DEMO_ACCOUNTS = [
  { role: 'Admin', username: 'admin1', password: 'admin123' },
  { role: 'Seller', username: 'seller1', password: 'seller123' },
  { role: 'Renter', username: 'renter1', password: 'renter123' },
] as const;

type FormState = LoginSchema;

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormState>({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleDemoFill = (username: string, password: string) => {
    setFormData({ username, password });
    setFormErrors({});
  };

  const validate = (): boolean => {
    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        fieldErrors[field] = issue.message;
      });
      setFormErrors(fieldErrors);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await authApi.login(formData.username, formData.password);
      if (response.success && response.data?.token && response.data.user) {
        const { token, user } = response.data;
        login(token, { userId: user.id, username: user.username, role: user.role });
        await showSuccess('Login berhasil!', `Selamat datang kembali, ${user.username}!`);
        const rawFrom = searchParams.get('from') || searchParams.get('redirect') || '/';
        const safeFrom =
          rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '/';
        router.push(safeFrom);
      } else {
        await showError(
          response.error || response.message || 'Username atau password salah',
          'Login Gagal'
        );
      }
    } catch (error) {
      const message =
        error instanceof z.ZodError
          ? error.issues.map((i) => i.message).join(', ')
          : (error as Error).message;
      await showError(message, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-between gap-4 px-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="text-base font-bold tracking-tight text-[var(--ink-primary)]">
              KOSERA
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-7 sm:p-8 shadow-sm">
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] text-[11px] font-semibold mb-3">
              Akses Akun
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
              Masuk ke Kosera
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Lanjutkan pencarian kos, favorit, dan pengajuan sewa Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <TextInput
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Masukkan username"
              error={formErrors.username}
            />
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Masukkan password"
              show={showPassword}
              toggle={() => setShowPassword((s) => !s)}
              error={formErrors.password}
            />
            {formErrors.general && (
              <p className="text-xs font-medium text-[var(--accent-danger)]">{formErrors.general}</p>
            )}
            <div className="pt-1">
              <SubmitButton
                loading={isLoading}
                idleLabel="Masuk"
                loadingLabel="Memproses..."
              />
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border-stone)] text-center">
            <p className="text-sm text-[var(--ink-secondary)]">
              Belum punya akun?{' '}
              <Link
                href="/auth/register"
                className="font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[14px]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs font-semibold text-[var(--ink-primary)]">Akun Demo</p>
              <span className="text-[11px] text-[var(--ink-secondary)]">Klik untuk isi cepat</span>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoFill(account.username, account.password)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-[10px] border border-[var(--border-stone)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] text-left transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span className="text-xs font-semibold text-[var(--ink-primary)]">
                    {account.role}
                  </span>
                  <span className="font-mono-tabular text-[11px] text-[var(--ink-secondary)]">
                    {account.username} / {account.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-canvas)] px-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-7 py-5 text-sm font-medium text-[var(--ink-secondary)]">
            Memuat halaman masuk...
          </div>
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}

export default LoginPage;
