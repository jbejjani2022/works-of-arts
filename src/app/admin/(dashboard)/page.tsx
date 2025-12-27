import { createClient } from '@/lib/supabase/server'
import { getArtworks } from '@/lib/supabase/queries'
import { ArtworksTableWrapper } from '@/components/admin/ArtworksTableWrapper'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export const revalidate = 0 // Disable caching for admin pages

export default async function AdminDashboard() {
  const supabase = await createClient()

  try {
    const artworks = await getArtworks(supabase, {
      orderBy: 'year',
      ascending: false,
    })

    return (
      <div className="space-y-8">
        <ArtworksTableWrapper initialArtworks={artworks} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-medium">Bio</h3>
            <p className="text-sm text-gray-600">
              Edit your artist bio - coming soon
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-medium">CV</h3>
            <p className="text-sm text-gray-600">
              Upload and manage your CV - coming soon
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load artworks:', error)
    return (
      <ErrorMessage
        message="Failed to load artworks. Please refresh the page."
        onRetry={() => window.location.reload()}
      />
    )
  }
}
