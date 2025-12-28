import { createClient } from '@/lib/supabase/server'
import {
  getArtworks,
  getBio,
  getCV,
  getHeadshot,
} from '@/lib/supabase/queries'
import { ArtworksTableWrapper } from '@/components/admin/ArtworksTableWrapper'
import { BioEditorWrapper } from '@/components/admin/BioEditorWrapper'
import { CVManagerWrapper } from '@/components/admin/CVManagerWrapper'
import { HeadshotManagerWrapper } from '@/components/admin/HeadshotManagerWrapper'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export const revalidate = 0 // Disable caching for admin pages

export default async function AdminDashboard() {
  const supabase = await createClient()

  let artworks
  let bio
  let cv
  let headshot
  let error

  try {
    ;[artworks, bio, cv, headshot] = await Promise.all([
      getArtworks(supabase, {
        orderBy: 'year',
        ascending: false,
      }),
      getBio(supabase),
      getCV(supabase),
      getHeadshot(supabase),
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
        {/* Left column: Headshot Manager + CV Manager */}
        <div className="space-y-6">
          <HeadshotManagerWrapper initialHeadshot={headshot ?? null} />
          <CVManagerWrapper initialCV={cv ?? null} />
        </div>

        {/* Right column: Bio Editor */}
        <BioEditorWrapper initialBio={bio} />
      </div>
    </div>
  )
}
