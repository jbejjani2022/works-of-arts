import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import type {
  Artwork,
  ArtworkInsert,
  ArtworkUpdate,
  Bio,
  BioUpdate,
  ArtworkMedium,
} from '../types'

type TypedSupabaseClient = SupabaseClient<Database>

// ============================================================================
// Artworks Queries
// ============================================================================

/**
 * Fetch all artworks, optionally filtered by medium
 */
export async function getArtworks(
  supabase: TypedSupabaseClient,
  options?: {
    medium?: ArtworkMedium
    orderBy?: 'year' | 'created_at'
    ascending?: boolean
  }
) {
  let query = supabase.from('artworks').select('*')

  // Apply medium filter if provided
  if (options?.medium) {
    query = query.eq('medium', options.medium)
  }

  // Apply ordering
  const orderBy = options?.orderBy || 'year'
  const ascending = options?.ascending ?? false
  query = query.order(orderBy, { ascending })

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch artworks: ${error.message}`)
  }

  return data as Artwork[]
}

/**
 * Fetch a single artwork by ID
 */
export async function getArtworkById(
  supabase: TypedSupabaseClient,
  id: string
) {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch artwork: ${error.message}`)
  }

  return data as Artwork
}

/**
 * Fetch a random artwork (for hero image)
 */
export async function getRandomArtwork(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase.from('artworks').select('*').limit(100) // Get up to 100 artworks, then pick random client-side

  if (error) {
    throw new Error(`Failed to fetch artworks: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return null
  }

  // Pick a random artwork from the results
  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex] as Artwork
}

/**
 * Create a new artwork
 */
export async function createArtwork(
  supabase: TypedSupabaseClient,
  artwork: ArtworkInsert
) {
  const { data, error } = await supabase
    .from('artworks')
    .insert(artwork)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create artwork: ${error.message}`)
  }

  return data as Artwork
}

/**
 * Update an existing artwork
 */
export async function updateArtwork(
  supabase: TypedSupabaseClient,
  id: string,
  updates: ArtworkUpdate
) {
  const { data, error } = await supabase
    .from('artworks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update artwork: ${error.message}`)
  }

  return data as Artwork
}

/**
 * Delete an artwork
 */
export async function deleteArtwork(supabase: TypedSupabaseClient, id: string) {
  const { error } = await supabase.from('artworks').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete artwork: ${error.message}`)
  }
}

// ============================================================================
// Bio Queries
// ============================================================================

/**
 * Fetch the bio content (assumes single row)
 */
export async function getBio(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase
    .from('bio')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    throw new Error(`Failed to fetch bio: ${error.message}`)
  }

  return data as Bio
}

/**
 * Update the bio content
 */
export async function updateBio(
  supabase: TypedSupabaseClient,
  id: string,
  updates: BioUpdate
) {
  const { data, error } = await supabase
    .from('bio')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update bio: ${error.message}`)
  }

  return data as Bio
}
