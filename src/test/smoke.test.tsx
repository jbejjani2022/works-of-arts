import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { formatDimensions } from '@/lib/utils'

describe('Smoke Tests', () => {
  it('should format dimensions correctly for paintings', () => {
    const result = formatDimensions(24, 18, null, 'Painting')
    expect(result).toBe('24" × 18"')
  })

  it('should format dimensions correctly for sculptures', () => {
    const result = formatDimensions(12, 8, 6, 'Sculpture')
    expect(result).toBe('6" × 8" × 12"')
  })

  it('should handle missing length for non-sculptures', () => {
    const result = formatDimensions(16, 12, null, 'Work on Paper')
    expect(result).toBe('16" × 12"')
  })
})
