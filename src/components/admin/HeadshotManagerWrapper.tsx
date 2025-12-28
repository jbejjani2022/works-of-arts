'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeadshotManager } from './HeadshotManager'
import type { Headshot } from '@/lib/types'

interface HeadshotManagerWrapperProps {
  initialHeadshot: Headshot | null
}

export function HeadshotManagerWrapper({
  initialHeadshot,
}: HeadshotManagerWrapperProps) {
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
      <HeadshotManager
        initialHeadshot={initialHeadshot}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
