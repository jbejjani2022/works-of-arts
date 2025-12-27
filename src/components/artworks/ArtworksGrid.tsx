import { ArtworkCard } from './ArtworkCard'
import { EmptyState } from '@/components/ui/ErrorMessage'
import type { Artwork, ArtworkMedium } from '@/lib/types'

interface ArtworksGridProps {
  artworks: Artwork[]
  filterMedium?: ArtworkMedium | null
}

export function ArtworksGrid({ artworks, filterMedium }: ArtworksGridProps) {
  // Filter artworks by medium if specified
  const filteredArtworks = filterMedium
    ? artworks.filter((artwork) => artwork.medium === filterMedium)
    : artworks

  if (filteredArtworks.length === 0) {
    const message = 'No artworks available.'

    return <EmptyState message={message} className="min-h-[400px]" />
  }

  return (
    <div className="flex flex-wrap gap-6">
      {filteredArtworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          filterMedium={filterMedium}
        />
      ))}
    </div>
  )
}
