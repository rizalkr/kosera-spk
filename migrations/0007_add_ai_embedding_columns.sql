-- Migration: Add AI embedding columns to kos table
-- Requires pgvector extension to be enabled first (see 0006_enable_pgvector_extension.sql)

-- 1. Add description_full column for combined searchable text
-- This will store the semantically formatted description for AI processing
ALTER TABLE kos ADD COLUMN IF NOT EXISTS description_full TEXT;

-- 2. Add embedding column for vector storage
-- Dimension 384 matches the output of all-MiniLM-L6-v2 model
-- Nullable to allow backward compatibility with existing data
ALTER TABLE kos ADD COLUMN IF NOT EXISTS embedding vector(384);

-- 3. Add comment for documentation
COMMENT ON COLUMN kos.description_full IS 'Combined semantic text (nama, lokasi, fasilitas, harga) for AI embedding generation';
COMMENT ON COLUMN kos.embedding IS 'Vector embedding from all-MiniLM-L6-v2 model (384 dimensions) for semantic search';

-- Note: Index creation is SKIPPED for datasets < 2000 rows
-- For production with large datasets, uncomment one of these:

-- Option A: IVFFlat index (good for large datasets > 10k rows)
-- CREATE INDEX IF NOT EXISTS kos_embedding_ivfflat_idx ON kos 
-- USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Option B: HNSW index (better for small-medium datasets, more stable)
-- CREATE INDEX IF NOT EXISTS kos_embedding_hnsw_idx ON kos 
-- USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
