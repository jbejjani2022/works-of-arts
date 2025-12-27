/**
 * Artist Configuration
 *
 * This file contains artist-specific settings that can be easily customized
 * when adapting this portfolio for a different artist.
 */

export const ARTIST_CONFIG = {
  /**
   * Artist name displayed throughout the site
   */
  name: 'Marcella Vlahos',

  /**
   * Artist photo URL for the About page
   *
   * Update this URL to point to your artist's photo.
   * Recommended dimensions: At least 800x1000px (portrait orientation)
   * Format: JPG or PNG
   *
   * Current URL points to Supabase Storage.
   * To update:
   * 1. Upload new photo to Supabase Storage (artworks bucket)
   * 2. Copy the public URL
   * 3. Replace the URL below
   */
  photoUrl:
    'https://xixlzbehrgmrbcakbjqv.supabase.co/storage/v1/object/public/artworks/About_page_photo.png',

  /**
   * Artist bio/description
   * This is a fallback if no bio is found in the database
   */
  bioFallback:
    'Contemporary artist working in painting, works on paper, and sculpture.',

  /**
   * Social media links (optional, for future use)
   */
  social: {
    instagram: '@marcella.vlahos',
    website: 'https://marcellavlahos.com',
    email: 'marcellavlahos@gmail.com',
  },
} as const
