'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ARTIST_CONFIG } from '@/lib/config'

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
  const searchParams = useSearchParams()
  const mediumFilter = searchParams?.get('medium') || null
  const isArtworksPage =
    pathname === '/artworks' || pathname?.startsWith('/artworks')
  const [isArtworksSubmenuOpen, setIsArtworksSubmenuOpen] =
    useState(isArtworksPage)

  // Keep submenu open when on artworks pages
  useEffect(() => {
    if (isArtworksPage) {
      setIsArtworksSubmenuOpen(true)
    }
  }, [isArtworksPage])

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
        <div className="p-6 flex-1 flex flex-col">
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
              <div className="flex items-center gap-0.5">
                <Link
                  href="/artworks"
                  className={`text-base text-black hover:opacity-60 transition-opacity cursor-pointer ${
                    isArtworksPage ? 'font-medium' : 'font-light'
                  }`}
                >
                  Artworks
                </Link>
                <button
                  onClick={() =>
                    setIsArtworksSubmenuOpen(!isArtworksSubmenuOpen)
                  }
                  className="text-sm text-black hover:opacity-60 transition-opacity cursor-pointer px-1"
                  aria-label="Toggle artworks submenu"
                >
                  {isArtworksSubmenuOpen ? '∨' : '>'}
                </button>
              </div>

              {/* Nested medium filters - show when submenu is open */}
              {isArtworksSubmenuOpen && (
                <div className="mt-3 ml-4 flex flex-col gap-2">
                  <Link
                    href="/artworks?medium=Painting"
                    className={`text-sm text-black hover:opacity-60 transition-opacity cursor-pointer ${
                      mediumFilter === 'Painting' ? 'font-medium' : 'font-light'
                    }`}
                  >
                    Paintings
                  </Link>
                  <Link
                    href="/artworks?medium=Work+on+Paper"
                    className={`text-sm text-black hover:opacity-60 transition-opacity cursor-pointer ${
                      mediumFilter === 'Work on Paper'
                        ? 'font-medium'
                        : 'font-light'
                    }`}
                  >
                    Works on Paper
                  </Link>
                  <Link
                    href="/artworks?medium=Sculpture"
                    className={`text-sm text-black hover:opacity-60 transition-opacity cursor-pointer ${
                      mediumFilter === 'Sculpture'
                        ? 'font-medium'
                        : 'font-light'
                    }`}
                  >
                    Sculpture
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Social links at bottom */}
          <div className="mt-auto pt-6 flex items-center gap-4">
            {ARTIST_CONFIG.social.instagram && (
              <a
                href={`https://instagram.com/${ARTIST_CONFIG.social.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-60 transition-opacity cursor-pointer"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {ARTIST_CONFIG.social.email && (
              <a
                href={`mailto:${ARTIST_CONFIG.social.email}`}
                className="text-black hover:opacity-60 transition-opacity cursor-pointer"
                aria-label="Email"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
