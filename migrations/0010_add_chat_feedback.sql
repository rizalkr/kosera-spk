-- Migration: Add anonymized chat_feedback table for SFT v2 dataset curation (Phase 7.4)

CREATE TABLE IF NOT EXISTS chat_feedback (
  id SERIAL PRIMARY KEY,
  session_hash VARCHAR(64) NOT NULL,
  user_prompt TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  tools_used JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating VARCHAR(10) NOT NULL CHECK (rating IN ('up', 'down')),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_feedback_rating_idx ON chat_feedback (rating);
CREATE INDEX IF NOT EXISTS chat_feedback_created_at_idx ON chat_feedback (created_at DESC);
