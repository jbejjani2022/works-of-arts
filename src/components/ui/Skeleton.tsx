/**
 * Minimal skeleton loading component
 * Clean, subtle pulse animation for art portfolio aesthetic
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-label="Loading..."
    />
  )
}

/**
 * Skeleton for artwork cards in grid
 */
export function ArtworkCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[3/4]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

/**
 * Skeleton for artworks grid
 */
export function ArtworksGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Skeleton for about page content
 */
export function AboutSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
