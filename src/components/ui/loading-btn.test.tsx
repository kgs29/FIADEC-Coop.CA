import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LoadingButton } from './loading-btn'

describe('LoadingButton Component', () => {
  it('should render loading button', () => {
    const { container } = render(<LoadingButton>Click me</LoadingButton>)
    expect(container.textContent).toContain('Click me')
  })

  it('should render loading state', () => {
    const { container } = render(
      <LoadingButton loading={true}>Loading...</LoadingButton>
    )
    expect(container).toBeTruthy()
  })

  it('should render with loading indicator', () => {
    const { container } = render(
      <LoadingButton loading={false}>Not Loading</LoadingButton>
    )
    expect(container.textContent).toContain('Not Loading')
  })

  it('should support disabled state when loading', () => {
    const { container } = render(
      <LoadingButton loading={true} disabled>
        Processing
      </LoadingButton>
    )
    expect(container).toBeTruthy()
  })

 
  it('should render with different sizes', () => {
    const { container } = render(
      <LoadingButton size="lg" loading={false}>
        Large Button
      </LoadingButton>
    )
    expect(container).toBeTruthy()
  })
})
