'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from './ConfirmDialog'
import { createClient } from '@/lib/supabase/client'
import { uploadHeadshot, deleteHeadshot } from '@/lib/supabase/storage'
import {
  updateHeadshot,
  createHeadshot,
  deleteHeadshotRecord,
} from '@/lib/supabase/queries'
import type { Headshot } from '@/lib/types'
import { format } from 'date-fns'

interface HeadshotManagerProps {
  initialHeadshot: Headshot | null
  onUpdate: () => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export function HeadshotManager({
  initialHeadshot,
  onUpdate,
}: HeadshotManagerProps) {
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
    if (file.type !== 'image/png') {
      setErrorMessage('Only PNG files are allowed')
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
      // 1. Upload new headshot file to storage, preserving original filename
      const timestamp = Date.now()
      const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileName = `${timestamp}-${cleanName}`
      const newHeadshotUrl = await uploadHeadshot(supabase, selectedFile, {
        fileName,
      })

      // 2. Delete old headshot file if one exists
      if (initialHeadshot?.headshot_link) {
        try {
          await deleteHeadshot(supabase, initialHeadshot.headshot_link)
        } catch (err) {
          // Log but don't fail if old file deletion fails
          console.warn('Failed to delete old headshot file:', err)
        }
      }

      // 3. Update or create headshot record in database
      if (initialHeadshot) {
        await updateHeadshot(supabase, initialHeadshot.id, {
          headshot_link: newHeadshotUrl,
        })
      } else {
        await createHeadshot(supabase, newHeadshotUrl)
      }

      setSuccessMessage('Headshot uploaded successfully!')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setTimeout(() => setSuccessMessage(''), 3000)
      onUpdate()
    } catch (error) {
      console.error('Failed to upload headshot:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload headshot'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialHeadshot) return

    setIsDeleting(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // 1. Delete headshot file from storage
      try {
        await deleteHeadshot(supabase, initialHeadshot.headshot_link)
      } catch (err) {
        // Log but continue even if file deletion fails
        console.warn('Failed to delete headshot file from storage:', err)
      }

      // 2. Delete headshot record from database
      await deleteHeadshotRecord(supabase, initialHeadshot.id)

      setSuccessMessage('Headshot deleted successfully!')
      setShowDeleteConfirm(false)

      setTimeout(() => setSuccessMessage(''), 3000)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete headshot:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to delete headshot'
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

  // Extract filename from headshot link for display
  const getCurrentFileName = () => {
    if (!initialHeadshot?.headshot_link) return null
    const parts = initialHeadshot.headshot_link.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-medium">Headshot Manager</h3>

      {/* Current Headshot Info */}
      {initialHeadshot ? (
        <div className="mb-4 rounded-md bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Current Headshot:</p>
          <p className="mt-1 truncate text-sm text-gray-600">
            {getCurrentFileName()}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Last updated:{' '}
            {initialHeadshot.updated_at
              ? format(new Date(initialHeadshot.updated_at), 'PPpp')
              : 'Unknown'}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <a
              href={initialHeadshot.headshot_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View Headshot →
            </a>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isUploading}
              className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete Headshot
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-600">No headshot uploaded yet</p>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {initialHeadshot
            ? 'Upload New Headshot (replaces current)'
            : 'Upload Headshot'}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,image/png"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          PNG only, max {MAX_FILE_SIZE / (1024 * 1024)} MB
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
            : initialHeadshot
              ? 'Replace Headshot'
              : 'Upload Headshot'}
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Headshot"
        message="Are you sure you want to delete the current headshot? This action cannot be undone and the headshot will be removed from your About page."
        confirmText="Delete Headshot"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}
