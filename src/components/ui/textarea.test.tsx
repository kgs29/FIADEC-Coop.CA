import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Textarea } from './textarea'

describe('Textarea Component', () => {
  it('should render textarea', () => {
    const { container } = render(<Textarea />)
    const textarea = container.querySelector('textarea')
    expect(textarea).toBeTruthy()
  })

  it('should render textarea with placeholder', () => {
    const { container } = render(<Textarea placeholder="Enter your message" />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea?.placeholder).toBe('Enter your message')
  })

  it('should render textarea with value', () => {
    const { container } = render(<Textarea value="Test content" readOnly />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea?.value).toBe('Test content')
  })

  it('should render disabled textarea', () => {
    const { container } = render(<Textarea disabled />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea?.disabled).toBe(true)
  })

  it('should support rows and cols attributes', () => {
    const { container } = render(<Textarea rows={5} cols={40} />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea?.rows).toBe(5)
    expect(textarea?.cols).toBe(40)
  })

  it('should have textarea styling', () => {
    const { container } = render(<Textarea />)
    const textarea = container.querySelector('textarea')
    expect(textarea?.className).toContain('flex')
  })
})
