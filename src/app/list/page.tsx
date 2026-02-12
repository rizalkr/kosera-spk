'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import FilterBar from '@/components/ui/FilterBar';
import { KosList } from '@/components/ui/KosList';
import type { SearchParams } from '@/types';

export default function DaftarKosPage() {
  const [filters, setFilters] = useState<SearchParams>({});

  const handleFilter = useCallback((newFilters: SearchParams) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen px-8 py-6 bg-[#A9E4DE] pt-20">
      <Header />
      <main className="mt-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-400">Daftar Kos</h1>
        <FilterBar onFilter={handleFilter} />
        <div className="mt-8">
          <KosList initialFilters={filters} />
        </div>
      </main>
      <Footer />
    </div>
  );
}