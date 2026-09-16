import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from './separator'

describe('Separator Component', () => {
  it('should render separator', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild
    expect(separator).toBeTruthy()
  })

  it('should render horizontal separator by default', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator?.className).toContain('bg-border')
  })

  it('should render vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const separator = container.firstChild
    expect(separator).toBeTruthy()
  })

  it('should have separator styling', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator?.className).toContain('bg-border')
  })

  it('should render separator with decorative prop', () => {
    const { container } = render(<Separator decorative />)
    const separator = container.firstChild
    expect(separator).toBeTruthy()
  })

  it('should support custom className', () => {
    const { container } = render(<Separator className="my-4" />)
    const separator = container.firstChild as HTMLElement
    expect(separator?.className).toContain('my-4')
  })
})
