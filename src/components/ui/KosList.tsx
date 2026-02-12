'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';
import FeaturedCard from './FeaturedCard';
import { useKosSearch, useFavorites } from '@/hooks/useApi';
import type { FavoriteKos, PublicKosData, SearchParams } from '@/types';

interface KosListProps {
  initialFilters?: SearchParams;
}

/**
 * KosList - Menampilkan daftar semua kos dengan filter dan pagination
 * Menggunakan /api/kos/search untuk mengambil data
 */
export const KosList = ({ initialFilters = {} }: KosListProps) => {
  const [page, setPage] = useState(1);
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [initialFilters]);
  
  // Combine filters with pagination - always fetch with empty search to get all
  const searchParams = useMemo(() => ({
    ...initialFilters,
    search: initialFilters.search || '', // Empty string to get all
    page,
    limit: 12,
  }), [initialFilters, page]);

  const { data, isLoading, error, refetch } = useKosSearch(searchParams);
  const { data: favoritesData } = useFavorites();

  // Debug logging
  useEffect(() => {
    console.log('[KosList] searchParams:', searchParams);
    console.log('[KosList] data:', data);
  }, [searchParams, data]);

  // Extract favorite kos IDs
  const favoriteKosIds = useMemo(() => {
    if (!favoritesData?.data?.favorites) return new Set<number>();
    return new Set(favoritesData.data.favorites.map((fav: FavoriteKos) => fav.kos.id));
  }, [favoritesData]);

  // Extract kos list from API response
  const kosList = useMemo(() => {
    if (!data?.data?.results) return [];
    return data.data.results as PublicKosData[];
  }, [data]);

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalResults = pagination?.total || kosList.length;

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#E1F6F2] border border-blue-100 rounded-xl shadow p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-blue-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-blue-200 rounded w-24"></div>
                <div className="h-4 bg-blue-200 rounded w-full"></div>
                <div className="h-4 bg-blue-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Gagal memuat data kos. Silakan coba lagi.</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 text-blue-400 hover:underline"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (kosList.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">Tidak ada kos yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="text-sm text-gray-600">
        Menampilkan {kosList.length} dari {totalResults} kos
      </div>

      {/* Kos list */}
      <div className="space-y-4">
        {kosList.map((kos) => (
          <FeaturedCard
            key={kos.id}
            id={kos.id}
            images={[]} // Not needed anymore, using database photos via hook
            price={kos.price.toLocaleString()}
            description={kos.description}
            area={kos.address}
            city={kos.city}
            rating={parseFloat(kos.averageRating || '0')}
            reviewCount={kos.reviewCount}
            facilities={kos.facilities ? kos.facilities.split(', ') : []}
            isFavorite={favoriteKosIds.has(kos.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-blue-400 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
          >
            Sebelumnya
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg ${
                    page === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-100'
                  } transition-colors`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-blue-400 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default KosList;
