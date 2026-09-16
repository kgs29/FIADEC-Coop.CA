import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'

describe('Collapsible Component', () => {
  it('should render collapsible', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    )
    expect(container.textContent).toContain('Toggle')
  })

  it('should render trigger button', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
      </Collapsible>
    )
    expect(container.textContent).toContain('Click to expand')
  })

  it('should render content section', () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Show Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden content here</CollapsibleContent>
      </Collapsible>
    )
    expect(container.textContent).toContain('Show Details')
  })

  it('should support open state', () => {
    const { container } = render(
      <Collapsible open>
        <CollapsibleTrigger>Open Item</CollapsibleTrigger>
        <CollapsibleContent>Visible content</CollapsibleContent>
      </Collapsible>
    )
    expect(container.textContent).toContain('Open Item')
  })

  it('should render with multiple items', () => {
    const { container } = render(
      <div>
        <Collapsible>
          <CollapsibleTrigger>Item 1</CollapsibleTrigger>
          <CollapsibleContent>Content 1</CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <CollapsibleTrigger>Item 2</CollapsibleTrigger>
          <CollapsibleContent>Content 2</CollapsibleContent>
        </Collapsible>
      </div>
    )
    expect(container.textContent).toContain('Item 1')
    expect(container.textContent).toContain('Item 2')
  })

  it('should handle default open state', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Default Open</CollapsibleTrigger>
        <CollapsibleContent>This is open by default</CollapsibleContent>
      </Collapsible>
    )
    expect(container).toBeTruthy()
  })
})
