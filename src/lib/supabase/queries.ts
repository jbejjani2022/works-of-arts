import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import type {
  Artwork,
  ArtworkInsert,
  ArtworkUpdate,
  Bio,
  BioUpdate,
  CV,
  CVUpdate,
  Headshot,
  HeadshotUpdate,
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

  // Always add secondary ordering by updated_at (most recent first)
  query = query.order('updated_at', { ascending: false })

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

// ============================================================================
// CV Queries
// ============================================================================

/**
 * Fetch the current CV link (assumes single row)
 */
export async function getCV(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase
    .from('cv')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // Return null if no CV exists yet
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch CV: ${error.message}`)
  }

  return data as CV
}

/**
 * Update the CV link
 */
export async function updateCV(
  supabase: TypedSupabaseClient,
  id: string,
  updates: CVUpdate
) {
  const { data, error } = await supabase
    .from('cv')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update CV: ${error.message}`)
  }

  return data as CV
}

/**
 * Create a new CV record (use when no CV exists yet)
 */
export async function createCV(supabase: TypedSupabaseClient, cvLink: string) {
  const { data, error } = await supabase
    .from('cv')
    .insert({ cv_link: cvLink })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create CV: ${error.message}`)
  }

  return data as CV
}

/**
 * Delete a CV record
 */
export async function deleteCVRecord(
  supabase: TypedSupabaseClient,
  id: string
) {
  const { error } = await supabase.from('cv').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete CV record: ${error.message}`)
  }
}

// ============================================================================
// Headshot Queries
// ============================================================================

/**
 * Fetch the current headshot (assumes single row)
 */
export async function getHeadshot(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase
    .from('headshot')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    // Return null if no headshot exists yet
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`Failed to fetch headshot: ${error.message}`)
  }

  return data as Headshot
}

/**
 * Update the headshot link
 */
export async function updateHeadshot(
  supabase: TypedSupabaseClient,
  id: string,
  updates: HeadshotUpdate
) {
  const { data, error } = await supabase
    .from('headshot')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update headshot: ${error.message}`)
  }

  return data as Headshot
}

/**
 * Create a new headshot record (use when no headshot exists yet)
 */
export async function createHeadshot(
  supabase: TypedSupabaseClient,
  headshotLink: string
) {
  const { data, error } = await supabase
    .from('headshot')
    .insert({ headshot_link: headshotLink })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create headshot: ${error.message}`)
  }

  return data as Headshot
}

/**
 * Delete a headshot record
 */
export async function deleteHeadshotRecord(
  supabase: TypedSupabaseClient,
  id: string
) {
  const { error } = await supabase.from('headshot').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete headshot record: ${error.message}`)
  }
}
