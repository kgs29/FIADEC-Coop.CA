import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rend un bouton', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('affiche une icône de soleil ou de lune', () => {
    const { container } = render(<ThemeToggle />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('bascule le thème au clic', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('repasse en light au deuxième clic', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
