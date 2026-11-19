'use client';

import { useState, useCallback } from 'react';
import { useAdminKos } from '@/hooks/admin/kos';
import type { AdminKosFilters } from '@/types';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import { AdminKosHeader } from '@/components/features/admin-kos/AdminKosHeader';
import { AdminKosFilter } from '@/components/features/admin-kos/AdminKosFilter';
import { AdminKosTable } from '@/components/features/admin-kos/AdminKosTable';
import { Pagination } from '@/components/ui/Pagination';

export default function AdminKosPage() {
  const [filters, setFilters] = useState<AdminKosFilters>({
    page: 1,
    limit: 10,
    search: '',
    city: 'all',
    ownerType: 'all',
    sortBy: 'newest',
    showDeleted: false,
    featured: 'all',
  });

  const { data, pagination, loading, error, refetch } = useAdminKos(filters);

  const handleFilterChange = useCallback((newFilters: Partial<AdminKosFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={['ADMIN']}>
      <div className="min-h-[100dvh] bg-[var(--bg-canvas)] pt-16 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <AdminKosHeader
            showDeleted={filters.showDeleted || false}
            onToggleView={() => handleFilterChange({ showDeleted: !filters.showDeleted })}
          />
          <AdminKosFilter initialFilters={filters} onFilterChange={handleFilterChange} />
          <AdminKosTable
            kosList={data}
            isLoading={loading || false}
            error={error}
            showDeleted={filters.showDeleted || false}
            currentPage={filters.page || 1}
            limit={filters.limit || 10}
            onActionComplete={refetch}
          />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
