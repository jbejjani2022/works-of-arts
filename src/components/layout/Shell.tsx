'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'

interface ShellProps {
  children: React.ReactNode
}

/**
 * Shell component for pages with always-visible sidebar (About, Artworks).
 * On mobile, sidebar can be toggled. On desktop, it's always visible.
 */
export function Shell({ children }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - always rendered, responsive behavior handled within */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        showMenuIcon={false}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile menu toggle button - only visible on mobile when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-6 left-6 z-30 md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center cursor-pointer"
            aria-label="Open menu"
          >
            <span className="block w-full h-0.5 bg-black" />
            <span className="block w-full h-0.5 bg-black" />
            <span className="block w-full h-0.5 bg-black" />
          </button>
        )}
        <div className="pt-16 md:pt-0">{children}</div>
      </main>
    </div>
  )
}
