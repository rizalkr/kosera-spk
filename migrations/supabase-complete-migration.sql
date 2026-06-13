-- =====================================================
-- SUPABASE COMPLETE MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Enable pgvector extension (Supabase has this built-in)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add AI embedding columns to kos table
ALTER TABLE kos ADD COLUMN IF NOT EXISTS description_full TEXT;
ALTER TABLE kos ADD COLUMN IF NOT EXISTS embedding vector(384);

-- 3. Add reviewer display fields to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_name TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_time_text TEXT;

-- 4. Add user preferences table if not exists
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    preferred_location TEXT,
    max_price INTEGER,
    min_price INTEGER,
    preferred_facilities TEXT[],
    preferred_city TEXT,
    search_radius_km DOUBLE PRECISION DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 5. Verify migrations
DO $$
BEGIN
    -- Check pgvector
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
        RAISE EXCEPTION 'pgvector extension not installed';
    END IF;
    RAISE NOTICE 'pgvector extension: OK';
    
    -- Check embedding column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'kos' AND column_name = 'embedding'
    ) THEN
        RAISE EXCEPTION 'embedding column not found in kos table';
    END IF;
    RAISE NOTICE 'kos.embedding column: OK';
    
    RAISE NOTICE 'All migrations completed successfully!';
END $$;

-- 6. Show current kos table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'kos' 
ORDER BY ordinal_position;
