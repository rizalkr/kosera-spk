-- Migration: Add structured Mamikos kos fields and HNSW pgvector index

ALTER TABLE kos ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE kos ADD COLUMN IF NOT EXISTS subdistrict TEXT;
ALTER TABLE kos ADD COLUMN IF NOT EXISTS room_size TEXT;
ALTER TABLE kos ADD COLUMN IF NOT EXISTS nearby_facilities TEXT;
ALTER TABLE kos ADD COLUMN IF NOT EXISTS rules TEXT;
ALTER TABLE kos ADD COLUMN IF NOT EXISTS source_url TEXT;

CREATE INDEX IF NOT EXISTS kos_gender_idx ON kos (gender);
CREATE INDEX IF NOT EXISTS kos_city_idx ON kos (city);
CREATE INDEX IF NOT EXISTS kos_subdistrict_idx ON kos (subdistrict);

-- Create HNSW index for cosine similarity search on 7,000+ rows
CREATE INDEX IF NOT EXISTS kos_embedding_hnsw_idx ON kos
USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
