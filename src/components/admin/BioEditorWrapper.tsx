'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BioEditor } from './BioEditor'
import type { Bio } from '@/lib/types'

interface BioEditorWrapperProps {
  initialBio: Bio
}

export function BioEditorWrapper({ initialBio }: BioEditorWrapperProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleUpdate = async () => {
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
      <BioEditor bio={initialBio} onUpdate={handleUpdate} />
    </div>
  )
}
