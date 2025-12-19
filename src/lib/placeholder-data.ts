import { Artwork, Bio } from './types'

export const placeholderArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Untitled I',
    year: 2023,
    medium: 'Painting',
    details: 'Oil on canvas',
    height: 24,
    width: 18,
    length: null,
    image_url: '/api/placeholder/600/800?text=Untitled+I',
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Study in Blue',
    year: 2023,
    medium: 'Work on Paper',
    details: 'Pastel on paper',
    height: 16,
    width: 12,
    length: null,
    image_url: '/api/placeholder/600/800?text=Study+in+Blue',
    created_at: '2023-02-20T14:30:00Z',
    updated_at: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'Emergence',
    year: 2022,
    medium: 'Sculpture',
    details: 'Bronze',
    height: 12,
    width: 8,
    length: 6,
    image_url: '/api/placeholder/600/800?text=Emergence',
    created_at: '2022-11-10T09:15:00Z',
    updated_at: '2022-11-10T09:15:00Z',
  },
  {
    id: '4',
    title: 'Morning Light',
    year: 2024,
    medium: 'Painting',
    details: 'Acrylic on canvas',
    height: 30,
    width: 24,
    length: null,
    image_url: '/api/placeholder/600/800?text=Morning+Light',
    created_at: '2024-01-05T11:20:00Z',
    updated_at: '2024-01-05T11:20:00Z',
  },
]

export const placeholderBio: Bio = {
  id: '1',
  content: `Marcella Vlahos is a contemporary artist working primarily in painting, works on paper, and sculpture. Her work explores themes of light, form, and the relationship between interior and exterior spaces.

Born and raised in the Pacific Northwest, Marcella draws inspiration from the natural landscape while investigating how traditional artistic mediums can express contemporary experiences. Her paintings often feature subtle color palettes that evoke the changing qualities of light throughout the day.

Recent exhibitions include solo shows at Gallery Modern and the Contemporary Art Center. Her work is held in private collections throughout the United States.`,
  updated_at: '2024-01-10T16:45:00Z',
}
