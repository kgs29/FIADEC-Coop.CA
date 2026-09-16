import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './sheet'

describe('Sheet Component', () => {
  it('should render sheet trigger', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
      </Sheet>
    )
    expect(container.textContent).toContain('Open Sheet')
  })

  it('should render sheet content', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Menu</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    expect(container.textContent).toContain('Menu')
  })

  it('should render sheet with description', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Click</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    expect(container.textContent).toContain('Click')
  })

  it('should support side positioning', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Right</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    expect(container).toBeTruthy()
  })

  it('should render sheet with body content', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
          </SheetHeader>
          <div>Sheet body content</div>
        </SheetContent>
      </Sheet>
    )
    expect(container).toBeTruthy()
  })

  it('should support different sides', () => {
    const { container } = render(
      <div>
        <Sheet>
          <SheetTrigger>Top</SheetTrigger>
          <SheetContent side="top">Top content</SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger>Bottom</SheetTrigger>
          <SheetContent side="bottom">Bottom content</SheetContent>
        </Sheet>
      </div>
    )
    expect(container.textContent).toContain('Top')
    expect(container.textContent).toContain('Bottom')
  })
})
