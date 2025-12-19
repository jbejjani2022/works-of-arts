# Supabase Setup Guide

This guide walks you through setting up a Supabase project for the Marcella Vlahos portfolio website.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Set project name: `marcella-vlahos-portfolio`
5. Set a strong database password
6. Choose a region close to your users
7. Click "Create new project"

Wait for the project to be created (usually 1-2 minutes).

## 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values for your `.env.local` file:
   - **Project URL**: Copy the URL
   - **Project API Keys**: Copy the `anon/public` key
   - **Service Role Key**: Copy the `service_role` key (keep this secret)

## 3. Database Schema

### Create Tables

Go to SQL Editor and run these commands:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create artworks table
CREATE TABLE artworks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  year integer NOT NULL,
  medium text NOT NULL CHECK (medium IN ('Painting', 'Work on Paper', 'Sculpture')),
  details text,
  height numeric NOT NULL,
  width numeric NOT NULL,
  length numeric,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create bio table
CREATE TABLE bio (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  content text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_artworks_medium ON artworks(medium);
CREATE INDEX idx_artworks_created_at ON artworks(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_artworks_updated_at
    BEFORE UPDATE ON artworks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bio_updated_at
    BEFORE UPDATE ON bio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Insert Initial Bio

```sql
INSERT INTO bio (content) VALUES (
  'Marcella Vlahos is a contemporary artist working primarily in painting, works on paper, and sculpture. Her work explores themes of light, form, and the relationship between interior and exterior spaces.

Born and raised in the Pacific Northwest, Marcella draws inspiration from the natural landscape while investigating how traditional artistic mediums can express contemporary experiences. Her paintings often feature subtle color palettes that evoke the changing qualities of light throughout the day.

Recent exhibitions include solo shows at Gallery Modern and the Contemporary Art Center. Her work is held in private collections throughout the United States.'
);
```

## 4. Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on tables
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio ENABLE ROW LEVEL SECURITY;

-- Artworks policies
CREATE POLICY "Allow anonymous read access on artworks"
ON artworks FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert artworks"
ON artworks FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update artworks"
ON artworks FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete artworks"
ON artworks FOR DELETE
TO authenticated
USING (true);

-- Bio policies
CREATE POLICY "Allow anonymous read access on bio"
ON bio FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update bio"
ON bio FOR UPDATE
TO authenticated
USING (true);
```

## 5. Storage Setup

### Create Storage Bucket

1. Go to Storage in the Supabase dashboard
2. Click "New bucket"
3. Name: `artworks`
4. Set as public bucket: **Yes**
5. Click "Create bucket"

### Storage Policies

Go to Storage → artworks bucket → Policies, then create these policies:

```sql
-- Allow public read access
CREATE POLICY "Give anon users access to artwork images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'artworks');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload artwork images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artworks');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated users to update artwork images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artworks');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated users to delete artwork images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artworks');
```

## 6. Authentication Setup

### Create Admin User

1. Go to Authentication → Users
2. Click "Add user"
3. Enter the artist's email address
4. Set a strong password
5. Click "Create user"

### Configure Auth Settings

1. Go to Authentication → Settings
2. **Site URL**: Set to your domain (for dev: `http://localhost:3000`)
3. **Email Templates**: Customize if needed (optional)
4. **Email Auth**: Should be enabled by default

## 7. Environment Variables

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 8. Test the Connection

Run your development server:

```bash
npm run dev
```

The app should now be able to connect to Supabase. Test by:

1. Visiting the home page (should load without errors)
2. Going to `/admin/login` and logging in with the created user
3. Checking browser console for any connection errors

## 9. Optional: Sample Data

To add sample artwork data for testing:

```sql
INSERT INTO artworks (title, year, medium, details, height, width, length, image_url) VALUES
('Untitled I', 2023, 'Painting', 'Oil on canvas', 24, 18, NULL, 'https://via.placeholder.com/600x800?text=Untitled+I'),
('Study in Blue', 2023, 'Work on Paper', 'Pastel on paper', 16, 12, NULL, 'https://via.placeholder.com/600x800?text=Study+in+Blue'),
('Emergence', 2022, 'Sculpture', 'Bronze', 12, 8, 6, 'https://via.placeholder.com/600x800?text=Emergence');
```

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Proper policies for read/write access
- ✅ Service role key kept secure (never in frontend code)
- ✅ Anon key properly scoped (read-only for public data)
- ✅ Storage bucket policies configured
- ✅ Admin user created with strong password

## Troubleshooting

### Common Issues

1. **Connection errors**: Check environment variables match dashboard
2. **Auth errors**: Verify Site URL in auth settings
3. **Upload errors**: Check storage policies are created
4. **RLS blocking queries**: Ensure policies allow the operations you need

### Useful SQL Queries

```sql
-- Check current RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check storage policies
SELECT * FROM storage.bucket_policies;

-- View all storage objects
SELECT * FROM storage.objects;
```
