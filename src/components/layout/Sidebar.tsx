'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  showMenuIcon?: boolean
  onNavigateHome?: () => void
  alwaysVisibleOnDesktop?: boolean
}

export function Sidebar({
  isOpen,
  onToggle,
  showMenuIcon = false,
  onNavigateHome,
  alwaysVisibleOnDesktop = true,
}: SidebarProps) {
  const pathname = usePathname()
  const isArtworksPage = pathname === '/artworks'

  // Determine visibility classes based on whether sidebar should be always visible on desktop
  const visibilityClasses = alwaysVisibleOnDesktop
    ? isOpen
      ? 'translate-x-0'
      : '-translate-x-full md:translate-x-0'
    : isOpen
      ? 'translate-x-0'
      : '-translate-x-full'

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden cursor-pointer"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white z-50
          transition-transform duration-300 ease-in-out
          w-64 flex flex-col border-r border-gray-200
          ${visibilityClasses}
          ${alwaysVisibleOnDesktop ? 'md:sticky md:top-0 md:h-screen' : ''}
        `}
      >
        <div className="p-6 flex-1">
          {/* Artist name - clickable to go home */}
          <div className="mb-8">
            <Link
              href="/"
              onClick={onNavigateHome}
              className="text-xl font-light text-black hover:opacity-60 transition-opacity cursor-pointer"
            >
              Marcella Vlahos
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4">
            <Link
              href="/about"
              className={`text-base text-black hover:opacity-60 transition-opacity cursor-pointer ${
                pathname === '/about' ? 'font-medium' : 'font-light'
              }`}
            >
              About
            </Link>

            <div>
              <Link
                href="/artworks"
                className={`text-base text-black hover:opacity-60 transition-opacity cursor-pointer ${
                  isArtworksPage ? 'font-medium' : 'font-light'
                }`}
              >
                Artworks
              </Link>

              {/* Nested medium filters - show when on artworks page */}
              {isArtworksPage && (
                <div className="mt-3 ml-4 flex flex-col gap-2">
                  <Link
                    href="/artworks?medium=Painting"
                    className="text-sm font-light text-black hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    Paintings
                  </Link>
                  <Link
                    href="/artworks?medium=Work+on+Paper"
                    className="text-sm font-light text-black hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    Works on Paper
                  </Link>
                  <Link
                    href="/artworks?medium=Sculpture"
                    className="text-sm font-light text-black hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    Sculpture
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
