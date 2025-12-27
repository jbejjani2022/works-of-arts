import { describe, it, expect } from 'vitest'
import { artworkSchema } from '../validation'

describe('artworkSchema', () => {
  const validBaseData = {
    title: 'Test Artwork',
    year: 2024,
    medium: 'Painting' as const,
    details: 'Oil on canvas',
    height: null,
    width: null,
    length: null,
    image: null,
  }

  describe('image validation', () => {
    it('should accept null image (for editing without new image)', () => {
      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: null,
      })
      expect(result.success).toBe(true)
    })

    it('should accept undefined image (for editing without new image)', () => {
      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: undefined,
      })
      expect(result.success).toBe(true)
    })

    it('should accept valid PNG File', () => {
      const pngFile = new File(['test'], 'test.png', { type: 'image/png' })
      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: pngFile,
      })
      expect(result.success).toBe(true)
    })

    it('should reject non-PNG images (JPEG)', () => {
      const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: jpegFile,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const imageError = result.error.issues.find((e) =>
          e.path.includes('image')
        )
        expect(imageError?.message).toBe('Only PNG images are allowed')
      }
    })

    it('should reject non-PNG images (GIF)', () => {
      const gifFile = new File(['test'], 'test.gif', { type: 'image/gif' })
      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: gifFile,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const imageError = result.error.issues.find((e) =>
          e.path.includes('image')
        )
        expect(imageError?.message).toBe('Only PNG images are allowed')
      }
    })

    it('should reject files larger than 10MB', () => {
      // Create a 11MB file
      const largeContent = new Uint8Array(11 * 1024 * 1024)
      const largeFile = new File([largeContent], 'large.png', {
        type: 'image/png',
      })

      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: largeFile,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const imageError = result.error.issues.find((e) =>
          e.path.includes('image')
        )
        expect(imageError?.message).toBe('Image must be less than 10MB')
      }
    })

    it('should accept PNG file under 10MB', () => {
      // Create a 1MB file
      const content = new Uint8Array(1 * 1024 * 1024)
      const file = new File([content], 'test.png', { type: 'image/png' })

      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: file,
      })
      expect(result.success).toBe(true)
    })

    it('should handle File-like objects with correct properties', () => {
      // Simulate a File-like object that might come from different contexts
      const fileLike = {
        name: 'test.png',
        size: 1024,
        type: 'image/png',
        lastModified: Date.now(),
        arrayBuffer: async () => new ArrayBuffer(0),
        slice: () => new Blob(),
        stream: () => new ReadableStream(),
        text: async () => '',
      }

      const result = artworkSchema.safeParse({
        ...validBaseData,
        image: fileLike,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('dimension validation', () => {
    it('should require both height and width for Paintings', () => {
      const result = artworkSchema.safeParse({
        ...validBaseData,
        medium: 'Painting',
        height: 24,
        width: null,
      })
      expect(result.success).toBe(false)
    })

    it('should accept all three dimensions for Sculpture', () => {
      const result = artworkSchema.safeParse({
        ...validBaseData,
        medium: 'Sculpture',
        height: 24,
        width: 18,
        length: 12,
      })
      expect(result.success).toBe(true)
    })

    it('should reject partial dimensions for Sculpture', () => {
      const result = artworkSchema.safeParse({
        ...validBaseData,
        medium: 'Sculpture',
        height: 24,
        width: 18,
        length: null,
      })
      expect(result.success).toBe(false)
    })
  })
})
