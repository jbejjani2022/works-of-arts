import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { createServerClient, getArtworkById } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/Skeleton'
import { ImageZoomModal } from '@/components/artworks/ImageZoomModal'

// Revalidate every 5 minutes
export const revalidate = 300

interface ArtworkDetailPageProps {
  params: Promise<{ id: string }>
}

async function ArtworkDetail({ id }: { id: string }) {
  try {
    const supabase = await createServerClient()
    const artwork = await getArtworkById(supabase, id)

    // Fetch all artworks in the same category for navigation
    const allArtworks = await supabase
      .from('artworks')
      .select('id')
      .eq('medium', artwork.medium)
      .order('year', { ascending: false })
      .order('created_at', { ascending: false })

    if (allArtworks.error) throw allArtworks.error

    // Find current position and calculate prev/next
    const artworkIds = allArtworks.data.map((a) => a.id)
    const currentIndex = artworkIds.indexOf(id)
    const totalCount = artworkIds.length
    const prevId = currentIndex > 0 ? artworkIds[currentIndex - 1] : null
    const nextId =
      currentIndex < totalCount - 1 ? artworkIds[currentIndex + 1] : null

    // Format dimensions based on medium
    const dimensions =
      artwork.medium === 'Sculpture'
        ? `${artwork.length}" × ${artwork.width}" × ${artwork.height}"`
        : `${artwork.height}" × ${artwork.width}"`

    // Build breadcrumb path based on artwork medium
    const breadcrumbMedium =
      artwork.medium === 'Painting'
        ? 'Paintings'
        : artwork.medium === 'Work on Paper'
          ? 'Works on Paper'
          : artwork.medium === 'Sculpture'
            ? 'Sculpture'
            : null

    const mediumUrl =
      artwork.medium === 'Painting'
        ? '/artworks?medium=Painting'
        : artwork.medium === 'Work on Paper'
          ? '/artworks?medium=Work+on+Paper'
          : artwork.medium === 'Sculpture'
            ? '/artworks?medium=Sculpture'
            : '/artworks'

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
              href={`/artworks/${prevId}`}
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
              href={`/artworks/${nextId}`}
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

              <div>
                <span>{dimensions}</span>
              </div>
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
}: ArtworkDetailPageProps) {
  const { id } = await params

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
          <ArtworkDetail id={id} />
        </Suspense>
      </div>
    </Shell>
  )
}
