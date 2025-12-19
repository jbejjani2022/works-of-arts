import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDimensions(
  height: number,
  width: number,
  length?: number | null,
  medium?: string
): string {
  if (medium === 'Sculpture' && length) {
    return `${length}" × ${width}" × ${height}"`
  }
  return `${height}" × ${width}"`
}

export function formatYear(year: number): string {
  return year.toString()
}

export function getRandomItem<T>(array: T[]): T | null {
  if (array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}
