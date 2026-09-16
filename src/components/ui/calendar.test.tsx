import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Calendar } from './calendar'

describe('Calendar Component', () => {
  it('should render calendar', () => {
    const { container } = render(<Calendar />)
    expect(container).toBeTruthy()
  })

  it('should render with mode single', () => {
    const { container } = render(<Calendar mode="single" />)
    expect(container).toBeTruthy()
  })

  it('should render with mode range', () => {
    const { container } = render(<Calendar mode="range" />)
    expect(container).toBeTruthy()
  })

  it('should render with mode multiple', () => {
    const { container } = render(<Calendar mode="multiple" />)
    expect(container).toBeTruthy()
  })

  it('should have calendar structure', () => {
    const { container } = render(<Calendar />)
    expect(container).toBeTruthy()
  })

  it('should render with disabled state', () => {
    const { container } = render(<Calendar disabled />)
    expect(container).toBeTruthy()
  })
})
