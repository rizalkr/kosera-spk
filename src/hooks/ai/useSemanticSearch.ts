'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';

/**
 * Semantic search result item
 */
export interface SemanticSearchResult {
  id: number;
  postId: number;
  name: string;
  address: string;
  city: string;
  facilities: string | null;
  totalRooms: number;
  occupiedRooms: number | null;
  availableRooms: number;
  title: string;
  description: string;
  price: number;
  averageRating: string;
  reviewCount: number;
  isFeatured: boolean;
  similarity: number;
  photos?: Array<{
    id: number;
    url: string;
    isPrimary: boolean;
  }>;
}

/**
 * Semantic search API response
 */
interface SemanticSearchResponse {
  success: boolean;
  message: string;
  data: {
    query: string;
    results: SemanticSearchResult[];
    total: number;
    searchType: 'semantic' | 'fallback';
  };
}

/**
 * Search filters for semantic search
 */
export interface SemanticSearchFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  facilities?: string[];
}

/**
 * Hook for semantic search with AI
 */
export const useSemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SemanticSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  // Only fetch when query is set
  const shouldFetch = query.trim().length > 0;

  const fetcher = async (url: string): Promise<SemanticSearchResponse> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        limit: 20,
        ...filters,
      }),
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR<SemanticSearchResponse>(
    shouldFetch ? `/api/kos/semantic-search?q=${encodeURIComponent(query)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  );

  const search = useCallback(
    async (searchQuery: string, searchFilters?: SemanticSearchFilters) => {
      setQuery(searchQuery);
      if (searchFilters) {
        setFilters(searchFilters);
      }
      setIsSearching(true);

      try {
        await mutate();
      } finally {
        setIsSearching(false);
      }
    },
    [mutate]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
  }, []);

  return {
    query,
    results: data?.data?.results ?? [],
    total: data?.data?.total ?? 0,
    searchType: data?.data?.searchType ?? 'semantic',
    isLoading: isLoading || isSearching,
    error,
    search,
    clearSearch,
    setFilters,
  };
};

/**
 * Check if AI service is available
 */
export const useAIServiceStatus = () => {
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('AI service unavailable');
    return response.json();
  };

  const { data, error } = useSWR('/api/ai/health', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000, // Check every minute
    errorRetryCount: 1,
  });

  return {
    isOnline: !error && data?.status === 'online',
    model: data?.model ?? null,
    isLoading: !data && !error,
  };
};
