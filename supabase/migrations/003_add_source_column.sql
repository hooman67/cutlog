-- Add data source tracking to cuts table
-- Tracks whether data came from user logs, AI baseline, or public scrapes

-- Add source column to cuts table
ALTER TABLE cuts ADD COLUMN source text NOT NULL DEFAULT 'user_logged' CHECK (source IN ('user_logged', 'ai_baseline', 'scraped_public'));

-- Create index for efficient filtering by source
CREATE INDEX idx_cuts_source ON cuts(source);

-- Create composite index for common queries (e.g., user's personal logs)
CREATE INDEX idx_cuts_user_source ON cuts(user_id, source);

-- Update existing shared cuts that appear to be community data to mark them appropriately
-- Note: Existing cuts default to 'user_logged' unless manually updated
COMMENT ON COLUMN cuts.source IS 'Data source: user_logged (user entered), ai_baseline (AI-generated reference), scraped_public (public domain data)';
