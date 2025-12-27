import { createServerClient, getRandomArtwork } from '@/lib/supabase'
import { HomeClient } from '@/components/home/HomeClient'

// Revalidate every hour to show different random artworks
export const revalidate = 3600

export default async function Home() {
  let artwork = null

  try {
    const supabase = await createServerClient()
    artwork = await getRandomArtwork(supabase)
  } catch (error) {
    console.error('Failed to fetch hero artwork:', error)
    // Continue with null artwork (will show black background)
  }

  return <HomeClient artwork={artwork} />
}
