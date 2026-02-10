/**
 * AI Module
 *
 * Provides AI-enhanced functionality for the DSS including:
 * - Text vectorization for semantic search
 * - Embedding generation and storage for kos listings
 * - Semantic similarity search
 * - Hybrid recommendation algorithm (PM-SPK + AI)
 *
 * @module lib/ai
 */

// AI Service Client
export {
  checkHealth,
  vectorize,
  vectorizeBatch,
  AIServiceError,
} from './client';

// Indexing Service
export {
  buildEmbeddingText,
  getKosWithoutEmbedding,
  indexSingleKos,
  indexBatch,
  reindexKos,
  getIndexingStats,
} from './indexer';

// Semantic Search
export {
  semanticSearch,
  findSimilarKos,
} from './search';

// Hybrid Algorithm
export {
  getHybridRecommendations,
  DEFAULT_HYBRID_WEIGHT_PM,
  DEFAULT_HYBRID_WEIGHT_AI,
} from './hybrid';
