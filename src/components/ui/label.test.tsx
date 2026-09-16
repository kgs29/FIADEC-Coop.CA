import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Label } from './label'

describe('Label Component', () => {
  it('should render label', () => {
    const { container } = render(<Label>Email</Label>)
    expect(container.textContent).toBe('Email')
  })

  it('should render label with htmlFor attribute', () => {
    const { container } = render(<Label htmlFor="email">Email Address</Label>)
    const label = container.querySelector('label')
    expect(label?.htmlFor).toBe('email')
  })

  it('should render label with custom className', () => {
    const { container } = render(<Label className="custom-class">Custom Label</Label>)
    const label = container.querySelector('label')
    expect(label?.className).toContain('custom-class')
  })

  it('should render label associated with input', () => {
    const { container } = render(
      <div>
        <Label htmlFor="username">Username</Label>
        <input id="username" type="text" />
      </div>
    )
    const label = container.querySelector('label')
    const input = container.querySelector('#username')
    expect(label?.htmlFor).toBe('username')
    expect(input).toBeTruthy()
  })

  it('should render label with required indicator', () => {
    const { container } = render(
      <Label>
        Password <span aria-label="required">*</span>
      </Label>
    )
    expect(container.textContent).toContain('Password')
    expect(container.textContent).toContain('*')
  })

  it('should have label styling', () => {
    const { container } = render(<Label>Styled Label</Label>)
    const label = container.querySelector('label')
    expect(label?.className).toContain('text-sm')
  })
})
