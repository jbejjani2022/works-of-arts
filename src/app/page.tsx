'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarToggle } from '@/components/layout/SidebarToggle'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Ensure sidebar is closed when returning to home page
  useEffect(() => {
    if (pathname === '/') {
      setIsSidebarOpen(false)
    }
  }, [pathname])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="relative min-h-screen flex">
      {/* Hero background - black placeholder for now */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* Overlay toggle button - only visible when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="absolute top-6 left-6 z-20">
          <SidebarToggle onToggle={toggleSidebar} />
        </div>
      )}

      {/* Sidebar - slides in smoothly, hideable on all screens */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        showMenuIcon={false}
        onNavigateHome={closeSidebar}
        alwaysVisibleOnDesktop={false}
      />

      {/* Dim overlay when sidebar is open */}
      {isSidebarOpen && <div className="absolute inset-0 bg-black/40 z-10" />}
    </div>
  )
}
