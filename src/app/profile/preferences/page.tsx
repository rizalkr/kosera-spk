'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { PreferencesForm } from '@/components/features/profile-matching';

/**
 * User Preferences Page
 * 
 * Allows users to set their preferences for profile matching recommendations.
 */
export default function PreferencesPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to recommendations page after saving
    router.push('/recommendations');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['RENTER', 'SELLER', 'ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-20">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Preferensi Pencarian Kos
            </h1>
            <p className="text-gray-600">
              Atur preferensi Anda untuk mendapatkan rekomendasi kos yang sesuai dengan kebutuhan
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-800 mb-2">
              Cara Kerja Profile Matching
            </h3>
            <p className="text-sm text-blue-700">
              Sistem akan mencocokkan preferensi Anda dengan karakteristik setiap kos dan 
              memberikan skor kecocokan (1-5). Semakin tinggi skor, semakin sesuai kos 
              tersebut dengan kebutuhan Anda.
            </p>
          </div>

          {/* Preferences Form */}
          <PreferencesForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
