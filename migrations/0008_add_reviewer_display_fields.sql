-- Migration: Add reviewer display fields to reviews table
-- This allows storing original reviewer names from scraped data

-- Add reviewer_name column for displaying original reviewer name
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_name TEXT;

-- Add review_time_text column for displaying original time text (e.g., "5 bulan lalu")
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_time_text TEXT;

-- Comments
COMMENT ON COLUMN reviews.reviewer_name IS 'Original reviewer name from scraped data (for display purposes)';
COMMENT ON COLUMN reviews.review_time_text IS 'Original review time text from scraped data (e.g., "5 bulan lalu")';
