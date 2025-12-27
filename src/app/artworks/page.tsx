import { Suspense } from 'react'
import { Shell } from '@/components/layout/Shell'
import { createServerClient, getArtworks, getCV } from '@/lib/supabase'
import { ArtworksGrid } from '@/components/artworks/ArtworksGrid'
import { ArtworksGridSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { ArtworkMedium } from '@/lib/types'

// Revalidate every 5 minutes
export const revalidate = 300

interface ArtworksPageProps {
  searchParams: Promise<{ medium?: string }>
}

async function ArtworksContent({
  filterMedium,
}: {
  filterMedium?: ArtworkMedium | null
}) {
  try {
    const supabase = await createServerClient()
    const artworks = await getArtworks(supabase, {
      orderBy: 'year',
      ascending: false,
    })

    // Calculate filtered count
    const filteredArtworks = filterMedium
      ? artworks.filter((artwork) => artwork.medium === filterMedium)
      : artworks
    const count = filteredArtworks.length

    return (
      <>
        <p className="text-sm font-light text-gray-500 -mt-6 mb-6">
          {count} {count === 1 ? 'item' : 'items'}
        </p>
        <ArtworksGrid artworks={artworks} filterMedium={filterMedium} />
      </>
    )
  } catch (error) {
    console.error('Failed to fetch artworks:', error)
    return (
      <ErrorMessage
        message="Failed to load artworks. Please try again later."
        className="min-h-[400px]"
      />
    )
  }
}

export default async function ArtworksPage({
  searchParams,
}: ArtworksPageProps) {
  const params = await searchParams
  // Parse medium filter from URL query params
  const mediumParam = params.medium
  const filterMedium =
    mediumParam === 'Painting' ||
    mediumParam === 'Work on Paper' ||
    mediumParam === 'Sculpture'
      ? mediumParam
      : null

  // Build page title with path
  const pageTitle = filterMedium
    ? `Artworks > ${filterMedium === 'Painting' ? 'Paintings' : filterMedium === 'Work on Paper' ? 'Works on Paper' : 'Sculpture'}`
    : 'Artworks'

  let cv = null
  try {
    const supabase = await createServerClient()
    cv = await getCV(supabase)
  } catch (error) {
    console.error('Failed to fetch CV:', error)
    // Continue with null cv
  }

  return (
    <Shell cv={cv}>
      <div className="p-6 md:p-12">
        <h1 className="text-3xl font-light mb-8">{pageTitle}</h1>
        <Suspense fallback={<ArtworksGridSkeleton />}>
          <ArtworksContent filterMedium={filterMedium} />
        </Suspense>
      </div>
    </Shell>
  )
}
