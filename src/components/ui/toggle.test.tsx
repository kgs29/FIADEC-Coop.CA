import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Toggle } from './toggle'

describe('Toggle Component', () => {
  it('should render toggle button', () => {
    const { container } = render(<Toggle>Click me</Toggle>)
    const button = container.querySelector('button')
    expect(button?.textContent).toContain('Click me')
  })

  it('should render toggle with icon', () => {
    const { container } = render(
      <Toggle>
        <span>Toggle</span>
      </Toggle>
    )
    const button = container.querySelector('button')
    expect(button).toBeTruthy()
  })

  it('should render toggle with pressed state', () => {
    const { container } = render(<Toggle pressed={true} readOnly>Active</Toggle>)
    const button = container.querySelector('button')
    expect(button?.getAttribute('aria-pressed')).toBe('true')
  })

  it('should render toggle with unpressed state', () => {
    const { container } = render(<Toggle pressed={false} readOnly>Inactive</Toggle>)
    const button = container.querySelector('button')
    expect(button?.getAttribute('aria-pressed')).toBe('false')
  })

  it('should support toggle size variants', () => {
    const { container } = render(<Toggle size="sm">Small</Toggle>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('h-8')
  })

  it('should support toggle variants', () => {
    const { container } = render(<Toggle variant="outline">Outline</Toggle>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('border')
  })
})
