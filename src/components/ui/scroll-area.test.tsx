import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ScrollArea } from './scroll-area'

describe('ScrollArea Component', () => {
  it('should render scroll area', () => {
    const { container } = render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    )
    expect(container.textContent).toContain('Content')
  })

  it('should render with height constraint', () => {
    const { container } = render(
      <ScrollArea className="h-72">
        <div>Scrollable Content</div>
      </ScrollArea>
    )
    expect(container.textContent).toContain('Scrollable Content')
  })

  it('should render with width constraint', () => {
    const { container } = render(
      <ScrollArea className="w-48">
        <div>Wide Content</div>
      </ScrollArea>
    )
    expect(container).toBeTruthy()
  })

  it('should render long content list', () => {
    const { container } = render(
      <ScrollArea>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </ScrollArea>
    )
    expect(container.textContent).toContain('Item 1')
    expect(container.textContent).toContain('Item 2')
    expect(container.textContent).toContain('Item 3')
  })

  it('should render with both axes scroll', () => {
    const { container } = render(
      <ScrollArea className="h-48 w-96">
        <div style={{ width: '800px', height: '600px' }}>Large content area</div>
      </ScrollArea>
    )
    expect(container).toBeTruthy()
  })

  it('should render scroll area with custom styling', () => {
    const { container } = render(
      <ScrollArea className="border rounded-md p-4">
        <div>Styled scrollable content</div>
      </ScrollArea>
    )
    expect(container).toBeTruthy()
  })
})
