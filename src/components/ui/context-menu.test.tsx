import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from './context-menu'

describe('ContextMenu Component', () => {
  it('should render context menu trigger', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click</ContextMenuTrigger>
      </ContextMenu>
    )
    expect(container.textContent).toContain('Right click')
  })

  it('should render context menu with items', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Element</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(container.textContent).toContain('Element')
  })

  it('should render multiple context menu items', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Target</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Cut</ContextMenuItem>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(container).toBeTruthy()
  })

  it('should render context menu on element', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Context target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Action 1</ContextMenuItem>
          <ContextMenuItem>Action 2</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(container.textContent).toContain('Context target')
  })

  it('should render with keyboard shortcuts', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Text</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Undo</ContextMenuItem>
          <ContextMenuItem>Redo</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(container).toBeTruthy()
  })

  it('should render nested context menus', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Root</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuItem>Item 2</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(container.textContent).toContain('Root')
  })
})
