import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './skeleton'

describe('Skeleton Component', () => {
  it('should render skeleton', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector('[class*="animate-pulse"]')
    expect(skeleton).toBeTruthy()
  })

  it('should render skeleton with custom className', () => {
    const { container } = render(<Skeleton className="w-12 h-12 rounded-full" />)
    const skeleton = container.querySelector('[class*="rounded-full"]')
    expect(skeleton?.className).toContain('rounded-full')
  })

  it('should render multiple skeletons', () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })

  it('should have skeleton styling', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector('[class*="bg-"]')
    expect(skeleton?.className).toContain('rounded-md')
  })

  it('should render skeleton with specific dimensions', () => {
    const { container } = render(<Skeleton className="h-8 w-8" />)
    const skeleton = container.querySelector('[class*="h-8"]')
    expect(skeleton?.className).toContain('h-8')
    expect(skeleton?.className).toContain('w-8')
  })

  it('should render avatar skeleton', () => {
    const { container } = render(<Skeleton className="w-10 h-10 rounded-full" />)
    const skeleton = container.querySelector('[class*="rounded-full"]')
    expect(skeleton?.className).toContain('w-10')
    expect(skeleton?.className).toContain('h-10')
  })
})
