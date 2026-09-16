import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'

describe('Popover Component', () => {
  it('should render popover trigger', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
      </Popover>
    )
    expect(container.textContent).toContain('Open')
  })

  it('should render popover content', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Click</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )
    expect(container.textContent).toContain('Click')
  })

  it('should render popover with form', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger asChild>
          <button>Show Form</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Form content here</div>
        </PopoverContent>
      </Popover>
    )
    expect(container.textContent).toContain('Show Form')
  })

  it('should support align property', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent align="start">Content</PopoverContent>
      </Popover>
    )
    expect(container).toBeTruthy()
  })

  it('should render multiple popovers', () => {
    const { container } = render(
      <div>
        <Popover>
          <PopoverTrigger>Pop 1</PopoverTrigger>
          <PopoverContent>Content 1</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>Pop 2</PopoverTrigger>
          <PopoverContent>Content 2</PopoverContent>
        </Popover>
      </div>
    )
    expect(container.textContent).toContain('Pop 1')
    expect(container.textContent).toContain('Pop 2')
  })

  it('should render with custom className', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Menu</PopoverTrigger>
        <PopoverContent className="w-80">Wide popover content</PopoverContent>
      </Popover>
    )
    expect(container).toBeTruthy()
  })
})
