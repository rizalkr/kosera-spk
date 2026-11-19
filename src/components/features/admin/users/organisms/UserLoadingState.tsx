import React from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export const UserLoadingState: React.FC = () => (
  <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
    <Header />
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[16px] px-8 py-6 flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--border-stone)] border-t-[var(--accent-primary)] animate-spin" />
        <p className="text-sm font-medium text-[var(--ink-secondary)]">Memuat data user...</p>
      </div>
    </main>
    <Footer />
  </div>
);
