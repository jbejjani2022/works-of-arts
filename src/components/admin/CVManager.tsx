'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from './ConfirmDialog'
import { createClient } from '@/lib/supabase/client'
import { uploadCV, deleteCV } from '@/lib/supabase/storage'
import { updateCV, createCV, deleteCVRecord } from '@/lib/supabase/queries'
import type { CV } from '@/lib/types'
import { format } from 'date-fns'

interface CVManagerProps {
  initialCV: CV | null
  onUpdate: () => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export function CVManager({ initialCV, onUpdate }: CVManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setErrorMessage('')
    setSuccessMessage('')

    if (!file) {
      setSelectedFile(null)
      return
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setErrorMessage('Only PDF files are allowed')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`
      )
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // 1. Upload new CV file to storage, preserving original filename
      const timestamp = Date.now()
      const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileName = `${timestamp}-${cleanName}`
      const newCVUrl = await uploadCV(supabase, selectedFile, { fileName })

      // 2. Delete old CV file if one exists
      if (initialCV?.cv_link) {
        try {
          await deleteCV(supabase, initialCV.cv_link)
        } catch (err) {
          // Log but don't fail if old file deletion fails
          console.warn('Failed to delete old CV file:', err)
        }
      }

      // 3. Update or create CV record in database
      if (initialCV) {
        await updateCV(supabase, initialCV.id, { cv_link: newCVUrl })
      } else {
        await createCV(supabase, newCVUrl)
      }

      setSuccessMessage('CV uploaded successfully!')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setTimeout(() => setSuccessMessage(''), 3000)
      onUpdate()
    } catch (error) {
      console.error('Failed to upload CV:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload CV'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialCV) return

    setIsDeleting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // 1. Delete CV file from storage
      try {
        await deleteCV(supabase, initialCV.cv_link)
      } catch (err) {
        // Log but continue even if file deletion fails
        console.warn('Failed to delete CV file from storage:', err)
      }

      // 2. Delete CV record from database
      await deleteCVRecord(supabase, initialCV.id)

      setSuccessMessage('CV deleted successfully!')
      setShowDeleteConfirm(false)

      setTimeout(() => setSuccessMessage(''), 3000)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete CV:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to delete CV'
      )
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClearSelection = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Extract filename from CV URL for display
  const getCurrentFileName = () => {
    if (!initialCV?.cv_link) return null
    const parts = initialCV.cv_link.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-medium">CV Manager</h3>

      {/* Current CV Info */}
      {initialCV ? (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Current CV:</p>
          <p className="mt-1 truncate text-sm text-gray-600">
            {getCurrentFileName()}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Last updated:{' '}
            {initialCV.updated_at
              ? format(new Date(initialCV.updated_at), 'PPpp')
              : 'Unknown'}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <a
              href={initialCV.cv_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View CV →
            </a>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isUploading}
              className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete CV
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-600">No CV uploaded yet</p>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {initialCV ? 'Upload New CV (replaces current)' : 'Upload CV'}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          PDF only, max {MAX_FILE_SIZE / (1024 * 1024)} MB
        </p>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50 p-3">
          <div>
            <p className="text-sm font-medium text-blue-900">
              Selected: {selectedFile.name}
            </p>
            <p className="text-xs text-blue-700">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button
            onClick={handleClearSelection}
            disabled={isUploading}
            className="text-sm text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      {/* Upload Button */}
      <div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="min-w-[120px]"
        >
          {isUploading
            ? 'Uploading...'
            : initialCV
              ? 'Replace CV'
              : 'Upload CV'}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete CV"
        message="Are you sure you want to delete the current CV? This action cannot be undone and the CV will be removed from your site."
        confirmText="Delete CV"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}
