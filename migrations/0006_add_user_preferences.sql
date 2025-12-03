-- Migration: Add user preferences table for Profile Matching SPK
-- Created: 2025-12-03

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Budget Preferences (Core Factor)
    budget_min INTEGER,                    -- Minimum budget (nullable = no minimum)
    budget_max INTEGER,                    -- Maximum budget (nullable = no maximum)
    
    -- Location Preferences (Core Factor)
    preferred_cities TEXT[],               -- Array of preferred cities
    preferred_latitude DOUBLE PRECISION,   -- User's preferred location lat
    preferred_longitude DOUBLE PRECISION,  -- User's preferred location lng
    max_distance_km DECIMAL(5,2),         -- Maximum distance in km
    
    -- Facilities Preferences (Secondary Factor)
    required_facilities TEXT[],            -- Must-have facilities
    optional_facilities TEXT[],            -- Nice-to-have facilities
    
    -- Room Preferences (Secondary Factor)
    room_type TEXT DEFAULT 'any',          -- 'single', 'shared', 'any'
    
    -- Quality Preferences (Core Factor)
    min_rating DECIMAL(2,1) DEFAULT 3.0,   -- Minimum acceptable rating (1.0-5.0)
    
    -- Availability Preferences
    needs_available_room BOOLEAN DEFAULT TRUE,
    
    -- Weighting Preferences (user-defined weights, must sum to 100)
    weight_price INTEGER DEFAULT 30 CHECK (weight_price >= 0 AND weight_price <= 100),
    weight_location INTEGER DEFAULT 25 CHECK (weight_location >= 0 AND weight_location <= 100),
    weight_facilities INTEGER DEFAULT 25 CHECK (weight_facilities >= 0 AND weight_facilities <= 100),
    weight_rating INTEGER DEFAULT 20 CHECK (weight_rating >= 0 AND weight_rating <= 100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT unique_user_preferences UNIQUE(user_id),
    CONSTRAINT valid_budget_range CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max),
    CONSTRAINT valid_min_rating CHECK (min_rating >= 1.0 AND min_rating <= 5.0),
    CONSTRAINT valid_total_weight CHECK (weight_price + weight_location + weight_facilities + weight_rating = 100)
);

-- Create indexes for better query performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_preferred_cities ON user_preferences USING GIN(preferred_cities);

-- Add comment for documentation
COMMENT ON TABLE user_preferences IS 'Stores user preferences for Profile Matching SPK recommendation system';
COMMENT ON COLUMN user_preferences.budget_min IS 'Minimum budget in IDR, null means no minimum';
COMMENT ON COLUMN user_preferences.budget_max IS 'Maximum budget in IDR, null means no maximum';
COMMENT ON COLUMN user_preferences.preferred_cities IS 'Array of preferred city names';
COMMENT ON COLUMN user_preferences.required_facilities IS 'Array of must-have facilities';
COMMENT ON COLUMN user_preferences.optional_facilities IS 'Array of nice-to-have facilities';
COMMENT ON COLUMN user_preferences.weight_price IS 'Weight for price matching (0-100), all weights must sum to 100';
