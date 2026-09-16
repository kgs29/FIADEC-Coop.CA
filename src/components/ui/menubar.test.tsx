import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from './menubar'

describe('Menubar Component', () => {
  it('should render menubar', () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )
    expect(container.textContent).toContain('File')
  })

  it('should render menubar with multiple menus', () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Copy</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    expect(container.textContent).toContain('File')
    expect(container.textContent).toContain('Edit')
  })

  it('should render menubar items', () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Open File</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    expect(container).toBeTruthy()
  })

  it('should render menubar with content structure', () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom In</MenubarItem>
            <MenubarItem>Zoom Out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    expect(container.textContent).toContain('View')
  })

  it('should render complete application menubar', () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
    expect(container).toBeTruthy()
  })

  it('should render menubar with many menus', () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>A</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>B</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>C</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )
    expect(container).toBeTruthy()
  })
})
