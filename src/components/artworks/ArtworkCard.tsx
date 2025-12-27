'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Artwork, ArtworkMedium } from '@/lib/types'

interface ArtworkCardProps {
  artwork: Artwork
  filterMedium?: ArtworkMedium | null
}

export function ArtworkCard({ artwork, filterMedium }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Build URL with filter context if present
  const href = filterMedium
    ? `/artworks/${artwork.id}?medium=${encodeURIComponent(filterMedium)}`
    : `/artworks/${artwork.id}`

  return (
    <Link
      href={href}
      className="group block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 inline-block">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          width={600}
          height={800}
          className="h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          style={{ width: 'auto', height: '100%' }}
        />

        {/* Hover overlay with title and year */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300">
            <div className="text-center text-white px-4">
              <h3 className="text-lg font-light">{artwork.title}</h3>
              <p className="text-sm mt-1">{artwork.year}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
