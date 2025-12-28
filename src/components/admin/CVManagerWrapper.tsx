'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CVManager } from './CVManager'
import type { CV } from '@/lib/types'

interface CVManagerWrapperProps {
  initialCV: CV | null
}

export function CVManagerWrapper({ initialCV }: CVManagerWrapperProps) {
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
      <CVManager initialCV={initialCV} onUpdate={handleUpdate} />
    </div>
  )
}
