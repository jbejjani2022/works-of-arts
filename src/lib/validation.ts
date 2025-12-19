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
    medium: z.enum(['Painting', 'Work on Paper', 'Sculpture'], {
      message: 'Medium is required',
    }),
    details: z.string().max(500, 'Details too long').optional(),
    height: z.number().positive('Height must be positive'),
    width: z.number().positive('Width must be positive'),
    length: z.number().positive('Length must be positive').optional(),
    image: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (data.medium === 'Sculpture') {
        return data.length !== undefined && data.length > 0
      }
      return true
    },
    {
      message: 'Length is required for sculptures',
      path: ['length'],
    }
  )

export const bioSchema = z.object({
  content: z.string().min(1, 'Bio content is required'),
})

export type ArtworkValidation = z.infer<typeof artworkSchema>
export type BioValidation = z.infer<typeof bioSchema>
