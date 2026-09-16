import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('initialise en theme light par défaut (pas de localStorage, pas de préférence dark)', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
  })

  it('utilise la préférence dark du système si pas de localStorage', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('utilise la valeur localStorage si disponible', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('toggle passe de light à dark', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('toggle passe de dark à light', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
  })

  it('toggle persiste le choix dans localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggle ajoute la classe dark au documentElement', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggle retire la classe dark au retour en light', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
