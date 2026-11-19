'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { showSuccess } from '@/lib/sweetalert';

export default function ComplaintPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showSuccess('Terima kasih, pengaduan Anda telah dikirim!', 'Pengaduan Berhasil Dikirim');
    setSubmitted(true);
  }

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[var(--bg-surface)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 border border-[var(--border-stone)] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-colors';

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-7 sm:p-9 space-y-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--accent-tint)] border border-[#BBDCD0] text-[11px] font-semibold text-[var(--accent-primary)] mb-2.5">
              Pusat Bantuan Kosera
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink-primary)]">
              Form Pengaduan
            </h1>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              Sampaikan kendala listing kos, proses booking, atau masukan pengalaman penggunaan Kosera.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[var(--bg-canvas)] border border-[var(--border-stone)] rounded-[16px] p-6 sm:p-8 text-center space-y-4">
              <div className="h-12 w-12 mx-auto rounded-full bg-[var(--accent-tint)] border border-[#BBDCD0] text-[var(--accent-primary)] flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[var(--ink-primary)]">
                  Pengaduan Berhasil Dikirim
                </h2>
                <p className="text-sm text-[var(--ink-secondary)]">
                  Terima kasih, laporan Anda telah dicatat dan akan segera kami tinjau.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2.5 rounded-[10px] text-xs font-semibold border border-[var(--border-stone)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:border-[var(--ink-secondary)] transition-colors cursor-pointer"
                >
                  Kirim Pengaduan Lain
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="complaint-nama"
                  className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
                >
                  Nama
                </label>
                <input
                  id="complaint-nama"
                  type="text"
                  name="nama"
                  required
                  placeholder="Masukkan nama lengkap"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="complaint-email"
                  className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="complaint-email"
                  type="email"
                  name="email"
                  required
                  placeholder="nama@email.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="complaint-pesan"
                  className="block text-xs font-semibold text-[var(--ink-primary)] mb-1.5"
                >
                  Pesan
                </label>
                <textarea
                  id="complaint-pesan"
                  name="pesan"
                  required
                  rows={5}
                  placeholder="Jelaskan detail kendala atau pengaduan Anda"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-[10px] text-sm font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Kirim Pengaduan
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
