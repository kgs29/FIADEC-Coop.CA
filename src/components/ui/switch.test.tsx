import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Switch } from './switch'

describe('Switch Component', () => {
  it('should render switch', () => {
    const { container } = render(<Switch />)
    const switchElement = container.querySelector('button[role="switch"]')
    expect(switchElement).toBeTruthy()
  })

  it('should render switch with unchecked state', () => {
    const { container } = render(<Switch />)
    const switchElement = container.querySelector('button[role="switch"]')
    expect(switchElement?.getAttribute('aria-checked')).toBe('false')
  })

  it('should render switch with checked state', () => {
    const { container } = render(<Switch checked={true} readOnly />)
    const switchElement = container.querySelector('button[role="switch"]')
    expect(switchElement?.getAttribute('aria-checked')).toBe('true')
  })

  it('should render disabled switch', () => {
    const { container } = render(<Switch disabled />)
    const switchElement = container.querySelector('button[role="switch"]') as HTMLButtonElement
    expect(switchElement?.disabled).toBe(true)
  })

  it('should support aria-label', () => {
    const { container } = render(<Switch aria-label="Enable notifications" />)
    const switchElement = container.querySelector('[aria-label="Enable notifications"]')
    expect(switchElement).toBeTruthy()
  })

  it('should have switch styling', () => {
    const { container } = render(<Switch />)
    const switchElement = container.querySelector('button[role="switch"]')
    expect(switchElement?.className).toContain('inline-flex')
  })
})
