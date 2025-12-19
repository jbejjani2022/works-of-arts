export interface Artwork {
  id: string
  title: string
  year: number
  medium: 'Painting' | 'Work on Paper' | 'Sculpture'
  details?: string
  height: number
  width: number
  length?: number | null
  image_url: string
  created_at: string
  updated_at: string
}

export interface Bio {
  id: string
  content: string
  updated_at: string
}

export type ArtworkFormData = Omit<
  Artwork,
  'id' | 'created_at' | 'updated_at' | 'image_url'
> & {
  image?: File
}

export interface User {
  id: string
  email: string
}
