import { describe, it, expect } from 'vitest'
import { IMAGES } from './images'

describe('constants/images', () => {
  it('exporte un objet IMAGES', () => {
    expect(typeof IMAGES).toBe('object')
    expect(IMAGES).not.toBeNull()
  })

  it('IMAGES contient undraw_unauthorized', () => {
    expect('undraw_unauthorized' in IMAGES).toBe(true)
  })
})
