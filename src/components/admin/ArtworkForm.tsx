'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { artworkSchema, type ArtworkValidation } from '@/lib/validation'
import type { Artwork } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { uploadArtworkImage, deleteArtworkImage } from '@/lib/supabase/storage'
import {
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from '@/lib/supabase/queries'

interface ArtworkFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  artwork?: Artwork
}

export function ArtworkForm({
  isOpen,
  onClose,
  onSuccess,
  artwork,
}: ArtworkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ArtworkValidation>({
    resolver: zodResolver(artworkSchema),
    defaultValues: artwork
      ? {
          title: artwork.title,
          year: artwork.year,
          medium: artwork.medium as 'Painting' | 'Work on Paper' | 'Sculpture',
          details: artwork.details || '',
          height: artwork.height || null,
          width: artwork.width || null,
          length: artwork.length || null,
          image: null,
        }
      : {
          title: '',
          year: new Date().getFullYear(),
          medium: 'Painting',
          details: '',
          height: null,
          width: null,
          length: null,
          image: null,
        },
  })

  const selectedMedium = watch('medium')
  const isEdit = !!artwork

  // Handle file input change
  // Note: We manually extract the File from FileList and use setValue instead of
  // register with setValueAs because react-hook-form's handling of file inputs
  // can be unreliable with setValueAs transformations
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setValue('image', file, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // Reset form with artwork values when editing
  useEffect(() => {
    if (artwork) {
      reset({
        title: artwork.title,
        year: artwork.year,
        medium: artwork.medium as 'Painting' | 'Work on Paper' | 'Sculpture',
        details: artwork.details || '',
        height: artwork.height || null,
        width: artwork.width || null,
        length: artwork.length || null,
        image: null,
      })
    } else {
      reset({
        title: '',
        year: new Date().getFullYear(),
        medium: 'Painting',
        details: '',
        height: null,
        width: null,
        length: null,
        image: null,
      })
    }
  }, [artwork, reset])

  const onSubmit = async (data: ArtworkValidation) => {
    setIsSubmitting(true)
    setError(null)

    try {
      let imageUrl = artwork?.image_url

      // Upload new image if provided
      if (data.image) {
        // Delete old image if editing
        if (artwork?.image_url) {
          try {
            await deleteArtworkImage(supabase, artwork.image_url)
          } catch (err) {
            console.error('Failed to delete old image:', err)
          }
        }

        imageUrl = await uploadArtworkImage(supabase, data.image)
      }

      // Validate that we have an image URL
      if (!imageUrl) {
        throw new Error('Image is required')
      }

      const artworkData = {
        title: data.title,
        year: data.year,
        medium: data.medium,
        details: data.details || null,
        height: data.height || null,
        width: data.width || null,
        length: data.length || null,
        image_url: imageUrl,
      }

      if (isEdit) {
        await updateArtwork(supabase, artwork.id, artworkData)
      } else {
        await createArtwork(supabase, artworkData)
      }

      reset()
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Failed to save artwork:', err)
      setError(err instanceof Error ? err.message : 'Failed to save artwork')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Artwork' : 'Upload New Artwork'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <Input
          label="Title"
          {...register('title')}
          error={errors.title?.message}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Year"
            type="number"
            {...register('year', { valueAsNumber: true })}
            error={errors.year?.message}
            required
          />

          <Select
            label="Medium"
            {...register('medium')}
            options={[
              { value: 'Painting', label: 'Painting' },
              { value: 'Work on Paper', label: 'Work on Paper' },
              { value: 'Sculpture', label: 'Sculpture' },
            ]}
            error={errors.medium?.message}
            required
          />
        </div>

        <Textarea
          label="Details"
          {...register('details')}
          error={errors.details?.message}
          rows={3}
          helperText="e.g., Pastel on paper"
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Dimensions (inches)
          </p>
          <p className="text-xs text-gray-500">
            {selectedMedium === 'Sculpture'
              ? 'Optional: Provide all three dimensions (height, width, length) or leave all empty'
              : 'Optional: Provide both height and width or leave both empty'}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Height"
              type="number"
              step="0.01"
              {...register('height', {
                setValueAs: (v) => {
                  if (v === '' || v === null || v === undefined) return null
                  const parsed = parseFloat(v)
                  return isNaN(parsed) ? null : parsed
                },
              })}
              error={errors.height?.message}
            />

            <Input
              label="Width"
              type="number"
              step="0.01"
              {...register('width', {
                setValueAs: (v) => {
                  if (v === '' || v === null || v === undefined) return null
                  const parsed = parseFloat(v)
                  return isNaN(parsed) ? null : parsed
                },
              })}
              error={errors.width?.message}
            />

            {selectedMedium === 'Sculpture' && (
              <Input
                label="Length"
                type="number"
                step="0.01"
                {...register('length', {
                  setValueAs: (v) => {
                    if (v === '' || v === null || v === undefined) return null
                    const parsed = parseFloat(v)
                    return isNaN(parsed) ? null : parsed
                  },
                })}
                error={errors.length?.message}
              />
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Image (PNG only){' '}
            {!isEdit && <span className="ml-1 text-red-600">*</span>}
          </label>
          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
          {isEdit && (
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to keep current image
            </p>
          )}
          {artwork?.image_url && (
            <a
              href={artwork.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              View current image
            </a>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Upload Artwork'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
