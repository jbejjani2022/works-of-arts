import { Suspense } from 'react'
import { Shell } from '@/components/layout/Shell'
import { createServerClient, getArtworks, getCV } from '@/lib/supabase'
import { ArtworksGrid } from '@/components/artworks/ArtworksGrid'
import { ArtworksGridSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { ArtworkMedium } from '@/lib/types'
import { generateMetadata as genMetadata } from '@/lib/metadata'

// Revalidate every 5 minutes
export const revalidate = 300

interface ArtworksPageProps {
  searchParams: Promise<{ medium?: string }>
}

export async function generateMetadata({ searchParams }: ArtworksPageProps) {
  const params = await searchParams
  const mediumParam = params.medium

  let title = 'Artworks'
  if (mediumParam === 'Painting') title = 'Paintings'
  else if (mediumParam === 'Work on Paper') title = 'Works on Paper'
  else if (mediumParam === 'Sculpture') title = 'Sculpture'

  return genMetadata({
    title,
    description: `Browse ${title.toLowerCase()} by contemporary artist`,
    path: params.medium ? `/artworks?medium=${params.medium}` : '/artworks',
  })
}

async function ArtworksContent({
  filterMedium,
}: {
  filterMedium?: ArtworkMedium | null
}) {
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
