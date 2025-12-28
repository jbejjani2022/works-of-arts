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
