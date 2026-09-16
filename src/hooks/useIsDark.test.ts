import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useIsDark } from './useIsDark'

// classList mutations are observed asynchronously via MutationObserver, so they
// must be wrapped (and awaited) in act() to avoid "not wrapped in act(...)" warnings.
describe('useIsDark', () => {
  beforeEach(async () => {
    await act(async () => {
      document.documentElement.classList.remove('dark')
    })
  })

  afterEach(async () => {
    await act(async () => {
      document.documentElement.classList.remove('dark')
    })
  })

  it('retourne false quand la classe dark est absente', () => {
    const { result } = renderHook(() => useIsDark())
    expect(result.current).toBe(false)
  })

  it('retourne true quand la classe dark est présente au montage', async () => {
    await act(async () => {
      document.documentElement.classList.add('dark')
    })
    const { result } = renderHook(() => useIsDark())
    expect(result.current).toBe(true)
  })

  it('retourne false quand dark est absent au montage (état initial)', () => {
    const { result } = renderHook(() => useIsDark())
    expect(result.current).toBe(false)
  })

  it('le hook retourne un booléen', () => {
    const { result } = renderHook(() => useIsDark())
    expect(typeof result.current).toBe('boolean')
  })
})
