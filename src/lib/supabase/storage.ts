import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type TypedSupabaseClient = SupabaseClient<Database>

const ARTWORKS_BUCKET = 'artworks'

/**
 * Upload an artwork image to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadArtworkImage(
  supabase: TypedSupabaseClient,
  file: File,
  options?: {
    fileName?: string
    onProgress?: (progress: number) => void
  }
): Promise<string> {
  // Generate a unique filename if not provided
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExt = file.name.split('.').pop()
  const fileName =
    options?.fileName || `${timestamp}-${randomString}.${fileExt}`

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(ARTWORKS_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete an artwork image from Supabase Storage
 */
export async function deleteArtworkImage(
  supabase: TypedSupabaseClient,
  imageUrl: string
): Promise<void> {
  // Extract the file path from the URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/artworks/<filename>
  const urlParts = imageUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]

  if (!fileName) {
    throw new Error('Invalid image URL')
  }

  const { error } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .remove([fileName])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

/**
 * Get the public URL for an artwork image
 */
export function getArtworkImageUrl(
  supabase: TypedSupabaseClient,
  filePath: string
): string {
  const { data } = supabase.storage.from(ARTWORKS_BUCKET).getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * List all files in the artworks bucket
 */
export async function listArtworkImages(
  supabase: TypedSupabaseClient,
  options?: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order: 'asc' | 'desc' }
  }
) {
  const { data, error } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .list('', {
      limit: options?.limit || 100,
      offset: options?.offset || 0,
      sortBy: options?.sortBy || { column: 'created_at', order: 'desc' },
    })

  if (error) {
    throw new Error(`Failed to list images: ${error.message}`)
  }

  return data
}
