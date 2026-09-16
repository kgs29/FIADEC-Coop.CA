import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Progress } from './progress'

describe('Progress Component', () => {
  it('should render progress bar', () => {
    const { container } = render(<Progress value={50} />)
    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).toBeTruthy()
  })

  it('should render progress at 0%', () => {
    const { container } = render(<Progress value={0} />)
    expect(container).toBeTruthy()
  })

  it('should render progress at 100%', () => {
    const { container } = render(<Progress value={100} />)
    expect(container).toBeTruthy()
  })

  it('should render progress at 75%', () => {
    const { container } = render(<Progress value={75} />)
    expect(container).toBeTruthy()
  })

  it('should have progress bar styling', () => {
    const { container } = render(<Progress value={50} />)
    const progressContainer = container.querySelector('[class*="bg-"]')
    expect(progressContainer?.className).toContain('h-2')
  })

  it('should render progress with max value', () => {
    const { container } = render(<Progress value={50} max={100} />)
    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar?.getAttribute('aria-valuemax')).toBe('100')
  })
})
