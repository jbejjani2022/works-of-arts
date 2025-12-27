'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArtworksTable } from './ArtworksTable'
import type { Artwork } from '@/lib/types'

interface ArtworksTableWrapperProps {
  initialArtworks: Artwork[]
}

export function ArtworksTableWrapper({
  initialArtworks,
}: ArtworksTableWrapperProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    router.refresh()
    // Give the router a moment to complete the refresh
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="relative">
      {isRefreshing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
      )}
      <ArtworksTable artworks={initialArtworks} onRefresh={handleRefresh} />
    </div>
  )
}
