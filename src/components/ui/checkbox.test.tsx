import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Checkbox } from './checkbox'

describe('Checkbox Component', () => {
  it('should render checkbox', () => {
    const { container } = render(<Checkbox />)
    const checkbox = container.querySelector('[role="checkbox"]')
    expect(checkbox).toBeTruthy()
  })

  it('should render checkbox with id', () => {
    const { container } = render(<Checkbox id="terms" />)
    const checkbox = container.querySelector('#terms')
    expect(checkbox).toBeTruthy()
  })

  it('should render unchecked checkbox by default', () => {
    const { container } = render(<Checkbox />)
    const checkbox = container.querySelector('[role="checkbox"]')
    expect(checkbox?.getAttribute('aria-checked')).toBe('false')
  })

  it('should render checked checkbox when checked prop is true', () => {
    const { container } = render(<Checkbox checked={true} readOnly />)
    const checkbox = container.querySelector('[role="checkbox"]')
    expect(checkbox?.getAttribute('aria-checked')).toBe('true')
  })

  it('should render disabled checkbox', () => {
    const { container } = render(<Checkbox disabled />)
    const checkbox = container.querySelector('[role="checkbox"]')
    expect(checkbox).toBeTruthy()
  })

  it('should support aria-label attribute', () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />)
    const checkbox = container.querySelector('[aria-label="Accept terms"]')
    expect(checkbox).toBeTruthy()
  })
})
