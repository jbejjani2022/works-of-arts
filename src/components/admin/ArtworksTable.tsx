'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ArtworkForm } from './ArtworkForm'
import { ConfirmDialog } from './ConfirmDialog'
import type { Artwork } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { deleteArtwork } from '@/lib/supabase/queries'
import { deleteArtworkImage } from '@/lib/supabase/storage'

interface ArtworksTableProps {
  artworks: Artwork[]
  onRefresh: () => void
}

type SortField = 'year' | 'created_at' | 'title' | 'medium'
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE = 10

export function ArtworksTable({ artworks, onRefresh }: ArtworksTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mediumFilter, setMediumFilter] = useState<string>('')
  const [yearFilter, setYearFilter] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>('year')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingArtwork, setEditingArtwork] = useState<Artwork | undefined>()
  const [deletingArtwork, setDeletingArtwork] = useState<Artwork | undefined>()
  const [isDeleting, setIsDeleting] = useState(false)

  const supabase = createClient()

  // Get unique years for filter
  const uniqueYears = useMemo(() => {
    const years = new Set(artworks.map((a) => a.year))
    return Array.from(years).sort((a, b) => b - a)
  }, [artworks])

  // Filter and sort artworks
  const filteredAndSortedArtworks = useMemo(() => {
    let filtered = artworks

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((artwork) =>
        artwork.title.toLowerCase().includes(query)
      )
    }

    // Apply medium filter
    if (mediumFilter) {
      filtered = filtered.filter((artwork) => artwork.medium === mediumFilter)
    }

    // Apply year filter
    if (yearFilter) {
      filtered = filtered.filter(
        (artwork) => artwork.year === parseInt(yearFilter)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'year':
          comparison = a.year - b.year
          break
        case 'created_at':
          if (a.created_at && b.created_at) {
            comparison =
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          }
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'medium':
          comparison = a.medium.localeCompare(b.medium)
          break
      }

      // Apply sort direction to primary comparison
      const sortedComparison =
        sortDirection === 'asc' ? comparison : -comparison

      // Break ties by updated_at (most recent first, always)
      if (sortedComparison === 0 && a.updated_at && b.updated_at) {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      }

      return sortedComparison
    })

    return filtered
  }, [
    artworks,
    searchQuery,
    mediumFilter,
    yearFilter,
    sortField,
    sortDirection,
  ])

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedArtworks.length / ITEMS_PER_PAGE
  )
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedArtworks = filteredAndSortedArtworks.slice(
    startIndex,
    endIndex
  )

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, mediumFilter, yearFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingArtwork) return

    setIsDeleting(true)
    try {
      // Delete the artwork from database
      await deleteArtwork(supabase, deletingArtwork.id)

      // Delete the image from storage
      if (deletingArtwork.image_url) {
        try {
          await deleteArtworkImage(supabase, deletingArtwork.image_url)
        } catch (err) {
          console.error('Failed to delete image from storage:', err)
        }
      }

      onRefresh()
      setDeletingArtwork(undefined)
    } catch (err) {
      console.error('Failed to delete artwork:', err)
      alert('Failed to delete artwork. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingArtwork(undefined)
  }

  const SortIcon = ({
    field,
    active,
  }: {
    field: SortField
    active: boolean
  }) => {
    if (!active || sortField !== field) {
      return (
        <span className="ml-1 text-gray-400">
          <svg
            className="inline h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </span>
      )
    }

    return (
      <span className="ml-1 text-black">
        {sortDirection === 'asc' ? (
          <svg
            className="inline h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="inline h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-light">Artworks</h2>
        <Button
          onClick={() => {
            setEditingArtwork(undefined)
            setIsFormOpen(true)
          }}
        >
          Upload Artwork
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select
          options={[
            { value: '', label: 'All mediums' },
            { value: 'Painting', label: 'Painting' },
            { value: 'Work on Paper', label: 'Work on Paper' },
            { value: 'Sculpture', label: 'Sculpture' },
          ]}
          value={mediumFilter}
          onChange={(e) => setMediumFilter(e.target.value)}
          placeholder="Filter by medium"
        />

        <Select
          options={[
            { value: '', label: 'All years' },
            ...uniqueYears.map((year) => ({
              value: year.toString(),
              label: year.toString(),
            })),
          ]}
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          placeholder="Filter by year"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}-
        {Math.min(endIndex, filteredAndSortedArtworks.length)} of{' '}
        {filteredAndSortedArtworks.length} artworks
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Title
                <SortIcon field="title" active={sortField === 'title'} />
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('year')}
              >
                Year
                <SortIcon field="year" active={sortField === 'year'} />
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('medium')}
              >
                Medium
                <SortIcon field="medium" active={sortField === 'medium'} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Dimensions
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                Created
                <SortIcon
                  field="created_at"
                  active={sortField === 'created_at'}
                />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedArtworks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  No artworks found
                </td>
              </tr>
            ) : (
              paginatedArtworks.map((artwork) => (
                <tr key={artwork.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    <a
                      href={artwork.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {artwork.title}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {artwork.year}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {artwork.medium}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {artwork.details || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {artwork.height && artwork.width
                      ? `${artwork.height}" × ${artwork.width}"${artwork.length ? ` × ${artwork.length}"` : ''}`
                      : '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {artwork.created_at
                      ? new Date(artwork.created_at).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(artwork)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingArtwork(artwork)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <ArtworkForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={onRefresh}
        artwork={editingArtwork}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingArtwork}
        onClose={() => setDeletingArtwork(undefined)}
        onConfirm={handleDelete}
        title="Delete Artwork"
        message={`Are you sure you want to delete "${deletingArtwork?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  )
}
