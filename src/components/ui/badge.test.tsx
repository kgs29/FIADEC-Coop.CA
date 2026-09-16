import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge Component', () => {
  it('should render badge text', () => {
    const { container } = render(<Badge>New</Badge>)
    expect(container.textContent).toBe('New')
  })

  it('should apply default variant class', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.querySelector('[class*="bg-"]')
    expect(badge?.className).toContain('bg-banner')
  })

  it('should apply secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    const badge = container.querySelector('[class*="bg-"]')
    expect(badge?.className).toContain('bg-secondary')
  })

  it('should apply destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>)
    const badge = container.querySelector('[class*="bg-"]')
    expect(badge?.className).toContain('bg-destructive')
  })

  it('should apply outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    const badge = container.querySelector('[class*="border"]')
    expect(badge?.className).toContain('border')
  })
})
