-- Migration: Enable pgvector extension for AI-Enhanced DSS
-- This extension enables vector similarity search for semantic search functionality

-- 1. Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Verify extension is installed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
        RAISE EXCEPTION 'pgvector extension failed to install';
    END IF;
    RAISE NOTICE 'pgvector extension installed successfully';
END $$;
