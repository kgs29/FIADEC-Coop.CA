import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Banner from './Banner'

describe('Banner Component', () => {
  it('should render banner container', () => {
    const { container } = render(<Banner />)
    const banner = container.querySelector('div')
    expect(banner).toBeTruthy()
  })

  it('should render banner with title', () => {
    const { container } = render(<Banner title="Test Banner" />)
    expect(container.textContent).toContain('Test Banner')
  })

  it('should render with red color class', () => {
    const { container } = render(<Banner color="red" />)
    expect(container.querySelector('div')?.className).toContain('bg-red-500')
  })

  it('should render with yellow color class', () => {
    const { container } = render(<Banner color="yellow" />)
    expect(container.querySelector('div')?.className).toContain('bg-yellow-500')
  })

  it('should render with blue color class', () => {
    const { container } = render(<Banner color="blue" />)
    expect(container.querySelector('div')?.className).toContain('bg-blue-900')
  })

  it('should render with green color class', () => {
    const { container } = render(<Banner color="green" />)
    expect(container.querySelector('div')?.className).toContain('bg-primary')
  })
})
