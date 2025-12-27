import { createServerClient, getRandomArtwork, getCV } from '@/lib/supabase'
import { HomeClient } from '@/components/home/HomeClient'

// Revalidate every hour to show different random artworks
export const revalidate = 3600

export default async function Home() {
  let artwork = null
  let cv = null

  try {
    const supabase = await createServerClient()
    artwork = await getRandomArtwork(supabase)
    cv = await getCV(supabase)
  } catch (error) {
    console.error('Failed to fetch data:', error)
    // Continue with null values
  }

  return <HomeClient artwork={artwork} cv={cv} />
}
