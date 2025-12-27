import { Tables, TablesInsert, TablesUpdate } from './supabase/database.types'

// Database row types (what you get from SELECT)
export type Artwork = Tables<'artworks'>
export type Bio = Tables<'bio'>

// Insert types (what you send to INSERT)
export type ArtworkInsert = TablesInsert<'artworks'>
export type BioInsert = TablesInsert<'bio'>

// Update types (what you send to UPDATE)
export type ArtworkUpdate = TablesUpdate<'artworks'>
export type BioUpdate = TablesUpdate<'bio'>

// Form data types
export type ArtworkFormData = Omit<
  Artwork,
  'id' | 'created_at' | 'updated_at' | 'image_url'
> & {
  image?: File
}

// Medium type for filtering
export type ArtworkMedium = 'Painting' | 'Work on Paper' | 'Sculpture'

// User type (from Supabase Auth)
export interface User {
  id: string
  email: string
}
