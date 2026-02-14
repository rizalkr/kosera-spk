'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import FilterBar from '@/components/ui/FilterBar';
import { KosList } from '@/components/ui/KosList';
import { SearchModeToggle, AIBadge, type SearchMode } from '@/components/ui/SearchModeToggle';
import FeaturedCard from '@/components/ui/FeaturedCard';
import { useSemanticSearch, useAIServiceStatus } from '@/hooks/ai';
import { useFavorites } from '@/hooks/useApi';
import type { SearchParams, FavoriteKos } from '@/types';

export default function DaftarKosPage() {
  const [filters, setFilters] = useState<SearchParams>({});
  const [searchMode, setSearchMode] = useState<SearchMode>('text');
  const [searchQuery, setSearchQuery] = useState('');

  // AI service status
  const { isOnline: isAIOnline } = useAIServiceStatus();

  // Semantic search hook
  const {
    results: semanticResults,
    total: semanticTotal,
    isLoading: isSemanticLoading,
    search: doSemanticSearch,
    clearSearch,
  } = useSemanticSearch();

  // Favorites
  const { data: favoritesData } = useFavorites();
  const favoriteKosIds = new Set(
    favoritesData?.data?.favorites?.map((fav: FavoriteKos) => fav.kos.id) ?? []
  );

  // Handle filter changes
  const handleFilter = useCallback(
    (newFilters: SearchParams) => {
      setFilters(newFilters);
      setSearchQuery(newFilters.search || '');

      // If AI mode and has search query, trigger semantic search
      if (searchMode === 'ai' && newFilters.search && newFilters.search.trim()) {
        doSemanticSearch(newFilters.search, {
          city: newFilters.city,
          minPrice: newFilters.minPrice,
          maxPrice: newFilters.maxPrice,
          facilities: newFilters.facilities,
        });
      }
    },
    [searchMode, doSemanticSearch]
  );

  // Handle search mode change
  const handleModeChange = useCallback(
    (mode: SearchMode) => {
      setSearchMode(mode);

      if (mode === 'ai' && searchQuery.trim()) {
        // Switch to AI mode with existing query
        doSemanticSearch(searchQuery, {
          city: filters.city,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          facilities: filters.facilities,
        });
      } else if (mode === 'text') {
        // Switch back to text mode
        clearSearch();
      }
    },
    [searchQuery, filters, doSemanticSearch, clearSearch]
  );

  // Auto-switch to text mode if AI goes offline
  useEffect(() => {
    if (!isAIOnline && searchMode === 'ai') {
      setSearchMode('text');
    }
  }, [isAIOnline, searchMode]);

  // Determine what to show
  const showSemanticResults = searchMode === 'ai' && searchQuery.trim() && semanticResults.length > 0;

  return (
    <div className="min-h-screen px-8 py-6 bg-[#A9E4DE] pt-20">
      <Header />
      <main className="mt-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-4xl font-bold text-blue-400">Daftar Kos</h1>
          <SearchModeToggle
            mode={searchMode}
            onChange={handleModeChange}
            isAIOnline={isAIOnline}
          />
        </div>

        <FilterBar onFilter={handleFilter} />

        <div className="mt-8">
          {/* AI Mode Info Banner */}
          {searchMode === 'ai' && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">Pencarian AI Aktif</h3>
                  <p className="text-sm text-purple-600">
                    Ketik dengan bahasa natural, contoh: &quot;kos nyaman dekat kampus dengan wifi cepat&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Semantic Search Results */}
          {showSemanticResults ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Ditemukan {semanticTotal} kos relevan
                  </span>
                  <AIBadge />
                </div>
              </div>

              {isSemanticLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
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
              ) : (
                <div className="space-y-4">
                  {semanticResults.map((kos) => (
                    <div key={kos.id} className="relative">
                      {kos.similarity && (
                        <div className="absolute top-2 right-2 z-10">
                          <AIBadge similarity={kos.similarity} />
                        </div>
                      )}
                      <FeaturedCard
                        id={kos.id}
                        images={[]}
                        price={kos.price.toLocaleString()}
                        description={kos.description}
                        area={kos.address}
                        city={kos.city}
                        rating={parseFloat(kos.averageRating || '0')}
                        reviewCount={kos.reviewCount}
                        facilities={kos.facilities ? kos.facilities.split(', ') : []}
                        isFavorite={favoriteKosIds.has(kos.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : searchMode === 'ai' && searchQuery.trim() && !isSemanticLoading && semanticResults.length === 0 ? (
            <div className="text-center py-12 bg-[#E1F6F2] rounded-xl">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">Tidak ada kos yang cocok dengan pencarian AI Anda.</p>
              <p className="text-sm text-gray-500 mt-2">Coba ubah kata kunci atau gunakan mode pencarian teks.</p>
            </div>
          ) : (
            /* Text Search Results - Default KosList */
            <KosList initialFilters={filters} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}