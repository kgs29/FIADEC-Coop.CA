import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from './button'

describe('Button Component', () => {
  it('should render a button with text', () => {
    const { container } = render(<Button>Click me</Button>)
    const button = container.querySelector('button')
    expect(button).toBeTruthy()
    expect(button?.textContent).toBe('Click me')
  })

  it('should apply default variant', () => {
    const { container } = render(<Button>Default</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('bg-banner')
  })

  it('should apply variant class', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('border')
  })

  it('should apply size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('h-10')
  })

  it('should be disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button?.disabled).toBe(true)
  })
})
