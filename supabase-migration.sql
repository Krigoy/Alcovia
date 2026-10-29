-- Supabase Migration: Create enrollments table
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_enrollments_email ON enrollments(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- No public policies: the /api/signup route writes with the service-role key,
-- which bypasses RLS. Leaving RLS on with no policies stops anyone using the
-- public anon key from inserting rows directly and skipping validation.
DROP POLICY IF EXISTS "Allow public insert" ON enrollments;

-- Create policy to allow authenticated users to read (optional - adjust as needed)
-- For now, we'll allow public read access via service role key in API routes
-- If you want to restrict access, create an authenticated policy:
-- CREATE POLICY "Allow authenticated read" ON enrollments
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- Optional: Add email validation constraint
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS email_format_check;
ALTER TABLE enrollments
  ADD CONSTRAINT email_format_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

