'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { useAuthToken } from '@/hooks/auth/useAuthToken';
import { adminApi, type CreateUserRequest, type CreateUserResponse } from '@/lib/api/admin';

export default function CreateUserPage() {
  const router = useRouter();
  const { getToken } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest & { confirmPassword: string }>({
    name: '',
    username: '',
    contact: '',
    role: 'RENTER',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Password dan konfirmasi password tidak cocok'); return; }
    if (formData.password.length < 6) { setError('Password minimal 6 karakter'); return; }
    try {
      setLoading(true); setError(null);
      const token = getToken();
      if (!token) throw new Error('No authentication token found');
      const payload: CreateUserRequest = {
        name: formData.name,
        username: formData.username,
        contact: formData.contact,
        role: formData.role,
        password: formData.password,
      };
      const result: CreateUserResponse = await adminApi.createUser(payload);
      if (result.error) throw new Error(result.error);
      router.push('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally { setLoading(false); }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[var(--bg-canvas)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-colors';

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-5 border-b border-[var(--border-stone)]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
                Tambah User Baru
              </h1>
              <p className="text-sm text-[var(--ink-secondary)] mt-1">
                Buat akun pengguna baru dalam sistem Kosera
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
            >
              Kembali ke Daftar User
            </button>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-[var(--accent-danger-tint)] border border-[#ECC6C0] rounded-[12px] p-4 text-sm font-medium text-[var(--accent-danger)]">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                    Nama Lengkap <span className="text-[var(--accent-danger)]">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Masukkan nama lengkap" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                    Username <span className="text-[var(--accent-danger)]">*</span>
                  </label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required className={inputClass} placeholder="Masukkan username (unik)" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                    Kontak <span className="text-[var(--accent-danger)]">*</span>
                  </label>
                  <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className={inputClass} placeholder="No. HP atau email" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                    Role <span className="text-[var(--accent-danger)]">*</span>
                  </label>
                  <select name="role" value={formData.role} onChange={handleChange} required className={inputClass}>
                    <option value="RENTER">Renter (Pencari Kos)</option>
                    <option value="SELLER">Seller (Pemilik Kos)</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                    Password <span className="text-[var(--accent-danger)]">*</span>
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className={inputClass} placeholder="Minimal 6 karakter" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5">
                    Konfirmasi Password <span className="text-[var(--accent-danger)]">*</span>
                  </label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} className={inputClass} placeholder="Ulangi password" />
                </div>
              </div>

              <div className="bg-[var(--accent-tint)] border border-[#BBDCD0] rounded-[14px] p-4">
                <h4 className="text-xs font-bold text-[var(--accent-primary)] mb-2">
                  Keterangan Role:
                </h4>
                <ul className="text-xs text-[var(--ink-primary)] space-y-1">
                  <li><strong>Renter:</strong> Pencari kos yang dapat menyimpan favorit dan mengajukan booking</li>
                  <li><strong>Seller:</strong> Pemilik kos yang mengelola properti, kamar, dan foto</li>
                  <li><strong>Admin:</strong> Akses penuh untuk mengelola platform Kosera</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Menyimpan...' : 'Simpan User'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/users')}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-[10px] text-sm font-medium border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
