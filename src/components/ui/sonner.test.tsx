import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { Toaster } from './sonner'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }),
  });
});

describe('Sonner Toaster', () => {
  it('rend sans erreur', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeTruthy()
  })
})
