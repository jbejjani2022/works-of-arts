# Headshot Manager Feature - Setup Instructions

The Headshot Manager feature has been implemented! This allows you to upload and manage the artist's headshot photo directly through the Admin CMS, rather than hardcoding a URL in the config file.

## What Changed

### Admin CMS Layout
- **Swapped columns**: CV Manager is now on the left, Bio Editor on the right
- **Added Headshot Manager**: Appears above the CV Manager in the left column
- The Headshot Manager works just like the CV Manager but for PNG images

### About Page
- Now displays the headshot from the database instead of a hardcoded URL
- Shows a placeholder if no headshot has been uploaded yet

### Configuration
- Removed `photoUrl` from `src/lib/config.ts` (no longer needed!)

## What You Need to Do on Supabase

You need to set up the database table and storage bucket for headshots. Follow these steps:

### Step 1: Create the `headshot` Table

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Run the following SQL:

```sql
-- Create headshot table
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
```

### Step 2: Create the `headshot` Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Settings:
   - **Name**: `headshot`
   - **Public bucket**: ✅ **YES** (check this box)
   - **Restrict file upload size**: Optional (you can set to 10 MB if desired)
   - **Allowed MIME types**: `image/png`
4. Click **"Create bucket"**

### Step 3: Set Up Storage Bucket Policies

After creating the bucket, you need to set up policies to allow:
- Public users to view the headshot (for the About page)
- Authenticated users (admin) to upload, update, and delete headshots

#### Option A: Using the Supabase UI (Easier)

1. Go to **Storage** → **headshot** bucket
2. Click **"Policies"** (top right)
3. Click **"New Policy"**
4. Create these 4 policies:

**Policy 1: Allow public SELECT**
- Template: "Allow public read access"
- Policy name: `Give anon users access to headshot files`
- Allowed operation: SELECT
- Target roles: `public`, `anon`
- USING expression: `bucket_id = 'headshot'`

**Policy 2: Allow authenticated INSERT**
- Template: "Allow authenticated users to upload"
- Policy name: `Allow authenticated users to upload headshot files`
- Allowed operation: INSERT
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'headshot'`

**Policy 3: Allow authenticated UPDATE**
- Template: "Allow authenticated users to update"
- Policy name: `Allow authenticated users to update headshot files`
- Allowed operation: UPDATE
- Target roles: `authenticated`
- USING expression: `bucket_id = 'headshot'`

**Policy 4: Allow authenticated DELETE**
- Template: "Allow authenticated users to delete"
- Policy name: `Allow authenticated users to delete headshot files`
- Allowed operation: DELETE
- Target roles: `authenticated`
- USING expression: `bucket_id = 'headshot'`

#### Option B: Using SQL (Advanced)

Alternatively, run this in the SQL Editor:

```sql
-- Allow public read access to headshot files
CREATE POLICY "Give anon users access to headshot files"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'headshot');

-- Allow authenticated users to upload headshot files
CREATE POLICY "Allow authenticated users to upload headshot files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'headshot');

-- Allow authenticated users to update headshot files
CREATE POLICY "Allow authenticated users to update headshot files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'headshot');

-- Allow authenticated users to delete headshot files
CREATE POLICY "Allow authenticated users to delete headshot files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'headshot');
```

### Step 4: Regenerate TypeScript Types

After setting up the database, regenerate your TypeScript types:

```bash
npm run supabase:types
```

## How to Use the Headshot Manager

1. Go to your admin dashboard: `http://localhost:3000/admin` (or your production URL)
2. Log in as admin
3. You'll see the new **Headshot Manager** at the top of the left column
4. Click **"Choose File"** and select a PNG image
5. Click **"Upload Headshot"**
6. The headshot will now display on your About page!

## Important Notes

- **File format**: Only PNG files are allowed
- **Max file size**: 50 MB (enforced by the app)
- **One at a time**: When you upload a new headshot, the old one is automatically deleted
- **Public access**: The headshot is publicly accessible so it can be displayed on the About page

## Verification

To verify everything is working:

1. Check that the `headshot` table exists in the Supabase **Table Editor**
2. Check that the `headshot` bucket exists in **Storage**
3. Upload a headshot via the Admin CMS
4. Visit the About page and verify the headshot displays
5. Try replacing the headshot with a new one

## Troubleshooting

### "Failed to upload headshot"
- Check that the `headshot` bucket exists and is public
- Verify the storage policies are set up correctly
- Check browser console for detailed error messages

### Headshot not displaying on About page
- Check that the file uploaded successfully (view in Supabase Storage)
- Verify the `headshot` table has a row with the correct link
- Check that RLS policies allow public read access

### "Only PNG files are allowed" error
- Make sure you're uploading a `.png` file, not `.jpg` or other formats
- The file must have MIME type `image/png`

## Need Help?

If you encounter any issues, check:
1. Browser console for error messages
2. Supabase logs (Dashboard → Logs)
3. Verify all SQL commands ran successfully
4. Ensure all storage policies are created

---

For more detailed information, see:
- [docs/migrations/001_add_headshots_table.sql](docs/migrations/001_add_headshots_table.sql) - Full migration SQL
- [docs/supabase-setup.md](docs/supabase-setup.md) - Complete Supabase setup guide
