# Supabase Integration

This directory contains the Supabase client configuration, type-safe query helpers, and storage utilities.

## Structure

- **`client.ts`** - Browser client for client components
- **`server.ts`** - Server client for server components and API routes
- **`database.types.ts`** - Auto-generated TypeScript types from database schema
- **`queries.ts`** - Type-safe query helpers for artworks and bio
- **`storage.ts`** - Storage helpers for artwork images
- **`index.ts`** - Exports all utilities for easy importing

## Usage

### Client Components

```typescript
import { createBrowserClient, getArtworks } from '@/lib/supabase'

const supabase = createBrowserClient()
const artworks = await getArtworks(supabase, { medium: 'Painting' })
```

### Server Components

```typescript
import { createServerClient, getBio } from '@/lib/supabase'

const supabase = await createServerClient()
const bio = await getBio(supabase)
```

## Query Helpers

### Artworks

- **`getArtworks(supabase, options?)`** - Fetch all artworks with optional filtering
  - `options.medium` - Filter by medium ('Painting', 'Work on Paper', 'Sculpture')
  - `options.orderBy` - Order by 'year' or 'created_at' (default: 'year')
  - `options.ascending` - Sort ascending (default: false)

- **`getArtworkById(supabase, id)`** - Fetch a single artwork by ID

- **`getRandomArtwork(supabase)`** - Get a random artwork (for hero image)

- **`createArtwork(supabase, artwork)`** - Create a new artwork

- **`updateArtwork(supabase, id, updates)`** - Update an existing artwork

- **`deleteArtwork(supabase, id)`** - Delete an artwork

### Bio

- **`getBio(supabase)`** - Fetch the bio content (single row)

- **`updateBio(supabase, id, updates)`** - Update the bio content

## Storage Helpers

- **`uploadArtworkImage(supabase, file, options?)`** - Upload an image to storage
  - Returns the public URL of the uploaded image
- **`deleteArtworkImage(supabase, imageUrl)`** - Delete an image from storage

- **`getArtworkImageUrl(supabase, filePath)`** - Get public URL for an image

- **`listArtworkImages(supabase, options?)`** - List all artwork images

## Type Generation

Types are automatically generated from your Supabase database schema.

### Regenerate Types

When you make changes to your database schema, regenerate the types:

```bash
npm run supabase:types
```

This will update `database.types.ts` with the latest schema from your Supabase project.

### Manual Type Generation

You can also generate types manually:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/database.types.ts
```

## Examples

### Fetch Artworks by Medium

```typescript
import { createServerClient, getArtworks } from '@/lib/supabase'

export default async function ArtworksPage() {
  const supabase = await createServerClient()
  const paintings = await getArtworks(supabase, {
    medium: 'Painting',
    orderBy: 'year',
    ascending: false
  })

  return (
    <div>
      {paintings.map(artwork => (
        <div key={artwork.id}>{artwork.title}</div>
      ))}
    </div>
  )
}
```

### Upload and Create Artwork

```typescript
import {
  createBrowserClient,
  uploadArtworkImage,
  createArtwork,
} from '@/lib/supabase'

async function handleSubmit(formData: FormData) {
  const supabase = createBrowserClient()
  const file = formData.get('image') as File

  // Upload image
  const imageUrl = await uploadArtworkImage(supabase, file)

  // Create artwork record
  const artwork = await createArtwork(supabase, {
    title: formData.get('title') as string,
    year: parseInt(formData.get('year') as string),
    medium: formData.get('medium') as
      | 'Painting'
      | 'Work on Paper'
      | 'Sculpture',
    height: parseFloat(formData.get('height') as string),
    width: parseFloat(formData.get('width') as string),
    image_url: imageUrl,
  })

  return artwork
}
```

## Error Handling

All query and storage helpers throw errors with descriptive messages. Wrap them in try-catch blocks:

```typescript
try {
  const artworks = await getArtworks(supabase)
} catch (error) {
  console.error('Failed to fetch artworks:', error)
  // Handle error appropriately
}
```
