-- Migration: Add headshot table for managing artist headshot photo
-- Date: 2025-12-27
-- Description: Creates the headshot table and related infrastructure for the Headshot Manager feature

-- ============================================================================
-- STEP 1: Create the headshot table
-- ============================================================================
-- Run this SQL in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)

CREATE TABLE IF NOT EXISTS public.headshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headshot_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_headshot_updated_at
  BEFORE UPDATE ON public.headshot
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.headshot ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for About page)
CREATE POLICY "Allow public read access to headshot"
  ON public.headshot
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users (admin) full access
CREATE POLICY "Allow authenticated users full access to headshot"
  ON public.headshot
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 2: Create the 'headshot' storage bucket
-- ============================================================================
-- Go to Storage in Supabase Dashboard (https://app.supabase.com/project/_/storage/buckets)
-- Click "Create a new bucket"
-- Bucket name: headshot
-- Public bucket: YES (check the box)
-- Click "Create bucket"

-- ============================================================================
-- STEP 3: Set up storage bucket policies
-- ============================================================================
-- After creating the bucket, go to the bucket policies section
-- Apply these policies to the 'headshot' bucket:

-- Policy 1: Allow public read access (so the About page can display the headshot)
-- Run this in the SQL Editor:

INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Allow public read access to headshot bucket',
  'headshot',
  '{"method": "GET", "resource": "*"}'
);

-- Policy 2: Allow authenticated users to upload headshots
-- This allows admin users to upload headshots via the Headshot Manager
-- You can set this up via the Supabase Dashboard UI:
--   1. Go to Storage > headshot bucket > Policies
--   2. Click "New Policy"
--   3. Template: "Allow authenticated users to upload"
--   4. Policy name: "Allow authenticated uploads to headshot bucket"
--   5. Allowed operation: INSERT
--   6. Target roles: authenticated
--   7. USING expression: true
--   8. WITH CHECK expression: true

-- Policy 3: Allow authenticated users to delete headshots
-- This allows admin users to delete old headshots when uploading new ones
-- You can set this up via the Supabase Dashboard UI:
--   1. Go to Storage > headshot bucket > Policies
--   2. Click "New Policy"
--   3. Template: "Allow authenticated users to delete"
--   4. Policy name: "Allow authenticated deletes from headshot bucket"
--   5. Allowed operation: DELETE
--   6. Target roles: authenticated
--   7. USING expression: true

-- ============================================================================
-- STEP 4: Regenerate TypeScript types
-- ============================================================================
-- After running the migration, regenerate the database types:
-- Run in your terminal: npm run supabase:types

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- To verify the migration was successful:
-- 1. Check that the headshot table exists in the Table Editor
-- 2. Check that the 'headshot' bucket exists in Storage
-- 3. Try uploading a headshot via the Admin CMS Headshot Manager
-- 4. Verify the headshot displays on the About page

-- ============================================================================
-- NOTES
-- ============================================================================
-- - The headshot table only stores the link to the file, not the actual file
-- - Files are stored in Supabase Storage in the 'headshot' bucket
-- - Only PNG files are allowed (enforced by the HeadshotManager component)
-- - Max file size is 50 MB (enforced by the HeadshotManager component)
-- - Only one headshot should exist at a time (old ones are deleted when uploading new)
