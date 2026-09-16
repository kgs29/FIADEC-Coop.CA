import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Input } from './input'

describe('Input Component', () => {
  it('should render an input field', () => {
    const { container } = render(<Input />)
    const input = container.querySelector('input')
    expect(input).toBeTruthy()
  })

  it('should have placeholder text', () => {
    const { container } = render(<Input placeholder="Enter text" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input?.placeholder).toBe('Enter text')
  })

  it('should accept value prop', () => {
    const { container } = render(<Input value="Test Value" readOnly />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input?.value).toBe('Test Value')
  })

  it('should be disabled when disabled prop is true', () => {
    const { container } = render(<Input disabled />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input?.disabled).toBe(true)
  })

  it('should have the correct input type', () => {
    const { container } = render(<Input type="email" />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input?.type).toBe('email')
  })
})
