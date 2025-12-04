-- Supabase Migration: Create users table for Clerk authentication
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert/read (for API routes)
-- Note: Service role key bypasses RLS, so this is mainly for documentation
CREATE POLICY "Allow service role full access" ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

