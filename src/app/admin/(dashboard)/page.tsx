import { createClient } from '@/lib/supabase/server'
import { getArtworks, getBio, getCV } from '@/lib/supabase/queries'
import { ArtworksTableWrapper } from '@/components/admin/ArtworksTableWrapper'
import { BioEditorWrapper } from '@/components/admin/BioEditorWrapper'
import { CVManagerWrapper } from '@/components/admin/CVManagerWrapper'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export const revalidate = 0 // Disable caching for admin pages

export default async function AdminDashboard() {
  const supabase = await createClient()

  let artworks
  let bio
  let cv
  let error

  try {
    ;[artworks, bio, cv] = await Promise.all([
      getArtworks(supabase, {
        orderBy: 'year',
        ascending: false,
      }),
      getBio(supabase),
      getCV(supabase),
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

        <CVManagerWrapper initialCV={cv ?? null} />
      </div>
    </div>
  )
}
