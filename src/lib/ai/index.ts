/**
 * AI Module
 *
 * Provides AI-enhanced functionality for the DSS including:
 * - Text vectorization for semantic search
 * - Embedding generation and storage for kos listings
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
