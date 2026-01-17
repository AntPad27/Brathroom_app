-- Run this in your Supabase SQL Editor to create the database tables

-- Bathrooms table
CREATE TABLE bathrooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  lat FLOAT8 NOT NULL,
  lng FLOAT8 NOT NULL,
  wheelchair_accessible BOOLEAN DEFAULT false,
  single_stall BOOLEAN DEFAULT false,
  gender_neutral BOOLEAN DEFAULT false,
  grab_bars BOOLEAN DEFAULT false,
  automatic_door BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bathroom_id UUID REFERENCES bathrooms(id) ON DELETE CASCADE,
  cleanliness INTEGER NOT NULL CHECK (cleanliness >= 1 AND cleanliness <= 5),
  accessibility INTEGER NOT NULL CHECK (accessibility >= 1 AND accessibility <= 5),
  privacy INTEGER NOT NULL CHECK (privacy >= 1 AND privacy <= 5),
  comment TEXT,
  device_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bathrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read bathrooms
CREATE POLICY "Anyone can read bathrooms"
  ON bathrooms FOR SELECT
  USING (true);

-- Allow anyone to insert bathrooms
CREATE POLICY "Anyone can insert bathrooms"
  ON bathrooms FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

-- Allow anyone to insert reviews
CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_reviews_bathroom_id ON reviews(bathroom_id);
CREATE INDEX idx_bathrooms_location ON bathrooms USING gist (ll_to_earth(lat, lng));
