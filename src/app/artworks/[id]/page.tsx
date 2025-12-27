import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { createServerClient, getArtworkById } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/Skeleton'
import { ImageZoomModal } from '@/components/artworks/ImageZoomModal'
import type { ArtworkMedium } from '@/lib/types'

// Revalidate every 5 minutes
export const revalidate = 300

interface ArtworkDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ medium?: string }>
}

async function ArtworkDetail({
  id,
  filterMedium,
}: {
  id: string
  filterMedium?: ArtworkMedium | null
}) {
  try {
    const supabase = await createServerClient()
    const artwork = await getArtworkById(supabase, id)

    // Fetch all artworks for navigation
    // IMPORTANT: Must match the exact query used on the artworks page
    // to ensure the ordering matches what's displayed in the grid
    const allArtworks = await supabase
      .from('artworks')
      .select('id, medium')
      .order('year', { ascending: false })

    if (allArtworks.error) throw allArtworks.error

    // Filter based on the context the user came from (filterMedium param)
    // If filterMedium is provided, filter by that medium; otherwise show all artworks
    const filteredArtworks = filterMedium
      ? allArtworks.data.filter((a) => a.medium === filterMedium)
      : allArtworks.data

    // Find current position and calculate prev/next
    // Reverse the array so the first card on the grid (top-left) is #1
    const artworkIds = filteredArtworks.map((a) => a.id)
    const currentIndex = artworkIds.indexOf(id)
    const totalCount = artworkIds.length
    const prevId = currentIndex > 0 ? artworkIds[currentIndex - 1] : null
    const nextId =
      currentIndex < totalCount - 1 ? artworkIds[currentIndex + 1] : null

    // Format dimensions based on medium and availability
    // For sculptures: only show if all three dimensions (width, height, length) are provided
    // For other mediums: only show if both width and height are provided
    const shouldShowDimensions =
      artwork.medium === 'Sculpture'
        ? artwork.width != null &&
          artwork.height != null &&
          artwork.length != null
        : artwork.width != null && artwork.height != null

    const dimensions = shouldShowDimensions
      ? artwork.medium === 'Sculpture'
        ? `${artwork.length}" × ${artwork.width}" × ${artwork.height}"`
        : `${artwork.height}" × ${artwork.width}"`
      : null

    // Build breadcrumb path based on filter context (not artwork medium)
    const breadcrumbMedium = filterMedium
      ? filterMedium === 'Painting'
        ? 'Paintings'
        : filterMedium === 'Work on Paper'
          ? 'Works on Paper'
          : 'Sculpture'
      : null

    const mediumUrl = filterMedium
      ? `/artworks?medium=${encodeURIComponent(filterMedium)}`
      : '/artworks'

    // Build filter query param for navigation links
    const filterQueryParam = filterMedium
      ? `?medium=${encodeURIComponent(filterMedium)}`
      : ''

    return (
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb navigation - stays at top */}
        <div className="text-sm text-gray-600 mb-1 md:mb-2">
          <Link
            href="/artworks"
            className="hover:text-black transition-colors underline cursor-pointer"
          >
            Artworks
          </Link>
          {breadcrumbMedium && (
            <>
              <span className="mx-1">{'>'}</span>
              <Link
                href={mediumUrl}
                className="hover:text-black transition-colors underline cursor-pointer"
              >
                {breadcrumbMedium}
              </Link>
            </>
          )}
        </div>

        {/* Sequential navigation - stays at top */}
        <div className="text-sm text-gray-600 mb-6 md:mb-8 flex items-center gap-2">
          {prevId ? (
            <Link
              href={`/artworks/${prevId}${filterQueryParam}`}
              className="hover:text-black transition-colors cursor-pointer"
            >
              {'<'}
            </Link>
          ) : (
            <span className="text-gray-300 cursor-not-allowed">{'<'}</span>
          )}
          <span>
            {currentIndex + 1} / {totalCount}
          </span>
          {nextId ? (
            <Link
              href={`/artworks/${nextId}${filterQueryParam}`}
              className="hover:text-black transition-colors cursor-pointer"
            >
              {'>'}
            </Link>
          ) : (
            <span className="text-gray-300 cursor-not-allowed">{'>'}</span>
          )}
        </div>

        {/* Main content - vertically centered */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            {/* Artwork image - clickable to open zoom modal */}
            <ImageZoomModal
              src={artwork.image_url}
              alt={`${artwork.title}, ${artwork.year}`}
            >
              <div className="relative w-full cursor-zoom-in">
                <Image
                  src={artwork.image_url}
                  alt={`${artwork.title}, ${artwork.year}`}
                  width={1200}
                  height={1600}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </ImageZoomModal>
          </div>

          {/* Artwork metadata */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-light mb-2">{artwork.title}</h1>
              <p className="text-lg text-gray-600">{artwork.year}</p>
            </div>

            <div className="space-y-3 text-base">
              {artwork.details && (
                <div>
                  <span>{artwork.details}</span>
                </div>
              )}

              {dimensions && (
                <div>
                  <span>{dimensions}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch artwork:', error)
    notFound()
  }
}

export default async function ArtworkDetailPage({
  params,
  searchParams,
}: ArtworkDetailPageProps) {
  const { id } = await params
  const { medium: mediumParam } = await searchParams

  // Parse medium filter from URL query params
  const filterMedium: ArtworkMedium | null =
    mediumParam === 'Painting' ||
    mediumParam === 'Work on Paper' ||
    mediumParam === 'Sculpture'
      ? mediumParam
      : null

  return (
    <Shell>
      <div className="p-4 md:p-12 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-sm text-gray-600 mb-6 md:mb-8">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <Skeleton className="w-full h-96" />
                <div className="space-y-6">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          }
        >
          <ArtworkDetail id={id} filterMedium={filterMedium} />
        </Suspense>
      </div>
    </Shell>
  )
}
