'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { showError, showSuccess } from '@/lib/sweetalert';
import { registerSchema, type RegisterSchema } from '@/lib/validation/authSchemas';
import { z } from 'zod';
import clsx from 'clsx';

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  type?: string;
  autoComplete?: string;
}

const TextInput = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  error,
  type = 'text',
  autoComplete,
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
        autoComplete="new-password"
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
    className="w-full mt-2 py-3 px-4 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

type FormState = RegisterSchema;
interface FormErrors {
  [k: string]: string | undefined;
}

const ROLE_OPTIONS: Array<{ value: 'RENTER' | 'SELLER'; label: string; caption: string }> = [
  { value: 'RENTER', label: 'Pencari Kos', caption: 'Cari & bandingkan kos' },
  { value: 'SELLER', label: 'Pemilik Kos', caption: 'Kelola properti kos' },
];

function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormState>({
    name: '',
    username: '',
    contact: '',
    password: '',
    confirmPassword: '',
    role: 'RENTER',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRoleSelect = (role: 'RENTER' | 'SELLER') => {
    setFormData((prev) => ({ ...prev, role }));
    if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }));
  };

  const validate = (): boolean => {
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      const next: FormErrors = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        next[field as string] = issue.message;
      });
      setErrors(next);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await authApi.register({
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        contact: formData.contact.trim(),
        password: formData.password,
        role: formData.role,
      });
      if (response.success && response.data?.token && response.data.user) {
        const { token, user } = response.data;
        login(token, { userId: user.id, username: user.username, role: user.role });
        await showSuccess('Registrasi Berhasil!', `Selamat datang di Kosera, ${user.username}!`);
        router.push('/');
      } else {
        await showError(
          response.error || response.message || 'Terjadi kesalahan saat mendaftar',
          'Registrasi Gagal'
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
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-tint)] text-[var(--accent-primary)] text-[11px] font-semibold mb-3">
              Akun Baru
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
              Daftar ke Kosera
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Buat akun baru untuk menyimpan favorit dan mengatur preferensi kos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <TextInput
              id="name"
              name="name"
              label="Nama Lengkap"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Masukkan nama lengkap"
              error={errors.name}
            />
            <TextInput
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Pilih username (min. 3 karakter)"
              error={errors.username}
            />
            <TextInput
              id="contact"
              name="contact"
              label="Nomor HP / Email"
              value={formData.contact}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="08123456789 atau email@example.com"
              error={errors.contact}
            />

            <div>
              <span className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                Daftar Sebagai
              </span>
              <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Daftar Sebagai">
                {ROLE_OPTIONS.map((opt) => {
                  const active = formData.role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={isLoading}
                      onClick={() => handleRoleSelect(opt.value)}
                      className={clsx(
                        'p-3 rounded-[12px] border text-left transition-colors cursor-pointer disabled:opacity-50',
                        active
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-tint)] text-[var(--accent-primary)]'
                          : 'border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)]'
                      )}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                        {opt.caption}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="mt-1 text-xs text-[var(--accent-danger)]">{errors.role}</p>}
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Minimal 6 karakter"
              show={showPassword}
              toggle={() => setShowPassword((s) => !s)}
              error={errors.password}
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Konfirmasi Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ulangi password"
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword((s) => !s)}
              error={errors.confirmPassword}
            />

            <SubmitButton
              loading={isLoading}
              idleLabel="Daftar Akun"
              loadingLabel="Mendaftar..."
            />
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border-stone)] text-center">
            <p className="text-sm text-[var(--ink-secondary)]">
              Sudah punya akun?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
