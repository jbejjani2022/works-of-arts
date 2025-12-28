import type { Metadata } from 'next'
import { ARTIST_CONFIG } from './config'

interface GenerateMetadataParams {
  title?: string
  description?: string
  image?: string
  path?: string
}

/**
 * Generate consistent metadata across all pages
 * Includes Open Graph and Twitter Card tags for social sharing
 */
export function generateMetadata({
  title,
  description = ARTIST_CONFIG.bioFallback,
  image = ARTIST_CONFIG.photoUrl,
  path = '',
}: GenerateMetadataParams = {}): Metadata {
  const siteName = ARTIST_CONFIG.name
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}${path}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
