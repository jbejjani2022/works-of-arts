import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type TypedSupabaseClient = SupabaseClient<Database>

const ARTWORKS_BUCKET = 'artworks'
const CV_BUCKET = 'CV'
const HEADSHOT_BUCKET = 'headshot'

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
  // Use original filename with timestamp prefix for uniqueness
  // This preserves the user's original filename while avoiding conflicts
  let fileName: string
  if (options?.fileName) {
    fileName = options.fileName
  } else {
    const timestamp = Date.now()
    // Clean the original filename: remove spaces and special chars except dash, underscore, and dot
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    fileName = `${timestamp}-${cleanName}`
  }

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

// ============================================================================
// CV Storage Helpers
// ============================================================================

/**
 * Upload a CV PDF to Supabase Storage
 * Returns the public URL of the uploaded PDF
 */
export async function uploadCV(
  supabase: TypedSupabaseClient,
  file: File,
  options?: {
    fileName?: string
  }
): Promise<string> {
  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed for CV uploads')
  }

  // Generate a unique filename if not provided
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileName = options?.fileName || `cv-${timestamp}-${randomString}.pdf`

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from(CV_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload CV: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(CV_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete a CV PDF from Supabase Storage
 */
export async function deleteCV(
  supabase: TypedSupabaseClient,
  cvUrl: string
): Promise<void> {
  // Extract the file path from the URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/CV/<filename>
  const urlParts = cvUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]

  if (!fileName) {
    throw new Error('Invalid CV URL')
  }

  const { error } = await supabase.storage.from(CV_BUCKET).remove([fileName])

  if (error) {
    throw new Error(`Failed to delete CV: ${error.message}`)
  }
}

/**
 * Get the public URL for a CV PDF
 */
export function getCVUrl(
  supabase: TypedSupabaseClient,
  filePath: string
): string {
  const { data } = supabase.storage.from(CV_BUCKET).getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * List all CV files in the bucket
 */
export async function listCVFiles(
  supabase: TypedSupabaseClient,
  options?: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order: 'asc' | 'desc' }
  }
) {
  const { data, error } = await supabase.storage.from(CV_BUCKET).list('', {
    limit: options?.limit || 100,
    offset: options?.offset || 0,
    sortBy: options?.sortBy || { column: 'created_at', order: 'desc' },
  })

  if (error) {
    throw new Error(`Failed to list CV files: ${error.message}`)
  }

  return data
}

// ============================================================================
// Headshot Storage Helpers
// ============================================================================

/**
 * Upload a headshot PNG to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadHeadshot(
  supabase: TypedSupabaseClient,
  file: File,
  options?: {
    fileName?: string
  }
): Promise<string> {
  // Validate file type
  if (file.type !== 'image/png') {
    throw new Error('Only PNG files are allowed for headshot uploads')
  }

  // Generate a unique filename if not provided
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileName =
    options?.fileName || `headshot-${timestamp}-${randomString}.png`

  // Upload file to storage
  const { data, error } = await supabase.storage
    .from(HEADSHOT_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload headshot: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(HEADSHOT_BUCKET)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * Delete a headshot PNG from Supabase Storage
 */
export async function deleteHeadshot(
  supabase: TypedSupabaseClient,
  headshotUrl: string
): Promise<void> {
  // Extract the file path from the URL
  // URL format: https://<project>.supabase.co/storage/v1/object/public/headshot/<filename>
  const urlParts = headshotUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]

  if (!fileName) {
    throw new Error('Invalid headshot URL')
  }

  const { error } = await supabase.storage
    .from(HEADSHOT_BUCKET)
    .remove([fileName])

  if (error) {
    throw new Error(`Failed to delete headshot: ${error.message}`)
  }
}

/**
 * Get the public URL for a headshot PNG
 */
export function getHeadshotUrl(
  supabase: TypedSupabaseClient,
  filePath: string
): string {
  const { data } = supabase.storage.from(HEADSHOT_BUCKET).getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * List all headshot files in the bucket
 */
export async function listHeadshotFiles(
  supabase: TypedSupabaseClient,
  options?: {
    limit?: number
    offset?: number
    sortBy?: { column: string; order: 'asc' | 'desc' }
  }
) {
  const { data, error } = await supabase.storage
    .from(HEADSHOT_BUCKET)
    .list('', {
      limit: options?.limit || 100,
      offset: options?.offset || 0,
      sortBy: options?.sortBy || { column: 'created_at', order: 'desc' },
    })

  if (error) {
    throw new Error(`Failed to list headshot files: ${error.message}`)
  }

  return data
}
