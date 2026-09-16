import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'

const MOBILE_BREAKPOINT = 768

describe('useIsMobile', () => {
  let listeners: Map<string, () => void>
  let mockMql: { addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    listeners = new Map()
    mockMql = {
      addEventListener: vi.fn((event, cb) => listeners.set(event, cb)),
      removeEventListener: vi.fn(),
    }
    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMql as unknown as MediaQueryList)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retourne false quand innerWidth >= 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('retourne true quand innerWidth < 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('retourne true exactement à la limite MOBILE_BREAKPOINT - 1', () => {
    Object.defineProperty(window, 'innerWidth', { value: MOBILE_BREAKPOINT - 1, writable: true, configurable: true })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('retourne false exactement à MOBILE_BREAKPOINT', () => {
    Object.defineProperty(window, 'innerWidth', { value: MOBILE_BREAKPOINT, writable: true, configurable: true })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('se met à jour quand le media query change', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true })
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true })
      listeners.get('change')?.()
    })
    expect(result.current).toBe(true)
  })

  it('enregistre et nettoie le listener media query', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true })
    const { unmount } = renderHook(() => useIsMobile())
    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    unmount()
    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
