import { Suspense } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import BookingAdminClient from './BookingAdminClient';

export default function AdminBookingPage() {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense
            fallback={
              <div className="bg-[var(--bg-surface)] border border-[var(--border-stone)] rounded-[20px] p-8 text-center text-sm text-[var(--ink-secondary)]">
                Memuat data booking...
              </div>
            }
          >
            <BookingAdminClient />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
