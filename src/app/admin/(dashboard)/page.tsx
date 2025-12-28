import { createClient } from '@/lib/supabase/server'
import { getArtworks, getBio } from '@/lib/supabase/queries'
import { ArtworksTableWrapper } from '@/components/admin/ArtworksTableWrapper'
import { BioEditorWrapper } from '@/components/admin/BioEditorWrapper'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export const revalidate = 0 // Disable caching for admin pages

export default async function AdminDashboard() {
  const supabase = await createClient()

  let artworks
  let bio
  let error

  try {
    ;[artworks, bio] = await Promise.all([
      getArtworks(supabase, {
        orderBy: 'year',
        ascending: false,
      }),
      getBio(supabase),
    ])
  } catch (err) {
    console.error('Failed to load admin data:', err)
    error = err
  }

  if (error || !artworks || !bio) {
    return (
      <ErrorMessage
        message="Failed to load admin dashboard. Please refresh the page."
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="space-y-8">
      <ArtworksTableWrapper initialArtworks={artworks} />

      <div className="grid gap-6 md:grid-cols-2">
        <BioEditorWrapper initialBio={bio} />

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-medium">CV</h3>
          <p className="text-sm text-gray-600">
            Upload and manage your CV - coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
