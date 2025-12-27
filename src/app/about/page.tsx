import Image from 'next/image'
import { Shell } from '@/components/layout/Shell'
import { createServerClient, getBio } from '@/lib/supabase'
import { ARTIST_CONFIG } from '@/lib/config'
import { AboutSkeleton } from '@/components/ui/Skeleton'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Suspense } from 'react'

// Revalidate every 5 minutes
export const revalidate = 300

async function AboutContent() {
  try {
    const supabase = await createServerClient()
    const bio = await getBio(supabase)

    return (
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Artist photo */}
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={ARTIST_CONFIG.photoUrl}
            alt={ARTIST_CONFIG.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Bio content */}
        <div className="flex flex-col justify-center space-y-6">
          <div
            className="text-base leading-relaxed prose prose-sm max-w-none"
            style={{ maxWidth: '65ch' }}
            dangerouslySetInnerHTML={{ __html: bio.content }}
          />

          {/* Contact information */}
          <div className="text-base space-y-1">
            {ARTIST_CONFIG.social.email && (
              <div>
                <a
                  href={`mailto:${ARTIST_CONFIG.social.email}`}
                  className="text-black hover:opacity-60 transition-opacity cursor-pointer"
                >
                  {ARTIST_CONFIG.social.email}
                </a>
              </div>
            )}
            {ARTIST_CONFIG.social.instagram && (
              <div>
                <a
                  href={`https://instagram.com/${ARTIST_CONFIG.social.instagram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:opacity-60 transition-opacity cursor-pointer"
                >
                  {ARTIST_CONFIG.social.instagram}
                </a>
              </div>
            )}
          </div>

          {bio.updated_at && (
            <p className="text-sm text-gray-400">
              Last updated: {new Date(bio.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch bio:', error)
    return (
      <ErrorMessage
        message="Failed to load bio content. Please try again later."
        className="min-h-[400px]"
      />
    )
  }
}

export default function AboutPage() {
  return (
    <Shell>
      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-light mb-8">About</h1>
        <Suspense fallback={<AboutSkeleton />}>
          <AboutContent />
        </Suspense>
      </div>
    </Shell>
  )
}
