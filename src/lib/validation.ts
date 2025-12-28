import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const artworkSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    year: z
      .number()
      .int('Year must be a whole number')
      .min(2000, 'Year must be 2000 or later')
      .max(currentYear, `Year cannot be later than ${currentYear}`),
    medium: z.enum(['Painting', 'Work on Paper', 'Sculpture']),
    details: z.string().max(500, 'Details too long').optional().nullable(),
    height: z
      .number()
      .positive('Height must be positive')
      .optional()
      .nullable(),
    width: z.number().positive('Width must be positive').optional().nullable(),
    length: z
      .number()
      .positive('Length must be positive')
      .optional()
      .nullable(),
    image: z
      .custom<File>(
        (val) => {
          // Allow null/undefined for optional cases (editing without new image)
          if (val === null || val === undefined) return true
          // Check if it's a File-like object
          return (
            val instanceof File ||
            (typeof val === 'object' &&
              val !== null &&
              'name' in val &&
              'size' in val &&
              'type' in val)
          )
        },
        { message: 'Must be a valid file' }
      )
      .refine(
        (file) => {
          if (!file) return true // Allow null/undefined
          return file.type === 'image/png'
        },
        { message: 'Only PNG images are allowed' }
      )
      .refine(
        (file) => {
          if (!file) return true // Allow null/undefined
          return file.size <= 50 * 1024 * 1024 // 50MB
        },
        { message: 'Image must be less than 50MB' }
      )
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const hasHeight = data.height !== null && data.height !== undefined
    const hasWidth = data.width !== null && data.width !== undefined
    const hasLength = data.length !== null && data.length !== undefined

    if (data.medium === 'Sculpture') {
      // For sculptures: either all three dimensions or none
      const dimensionCount = [hasHeight, hasWidth, hasLength].filter(
        Boolean
      ).length

      if (dimensionCount > 0 && dimensionCount < 3) {
        if (!hasHeight) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Height is required when dimensions are provided',
            path: ['height'],
          })
        }
        if (!hasWidth) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Width is required when dimensions are provided',
            path: ['width'],
          })
        }
        if (!hasLength) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Length is required when dimensions are provided',
            path: ['length'],
          })
        }
      }
    } else {
      // For Paintings and Works on Paper: either both height and width or neither
      if (hasHeight && !hasWidth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Width is required when height is provided',
          path: ['width'],
        })
      }
      if (hasWidth && !hasHeight) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Height is required when width is provided',
          path: ['height'],
        })
      }
      // Length should not be provided for non-sculptures
      if (hasLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Length is only applicable to sculptures',
          path: ['length'],
        })
      }
    }
  })

export const bioSchema = z.object({
  content: z.string().min(1, 'Bio content is required'),
})

export const cvSchema = z.object({
  file: z
    .instanceof(File, { message: 'CV file is required' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Only PDF files are allowed',
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File size must be less than 10MB',
    }),
})

export type ArtworkValidation = z.infer<typeof artworkSchema>
export type BioValidation = z.infer<typeof bioSchema>
export type CVValidation = z.infer<typeof cvSchema>
