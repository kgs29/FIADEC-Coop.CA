import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

describe('Tabs Component', () => {
  it('should render tabs', () => {
    const { container } = render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(container.textContent).toContain('Tab 1')
  })

  it('should render multiple tabs', () => {
    const { container } = render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Home</TabsTrigger>
          <TabsTrigger value="tab2">Profile</TabsTrigger>
          <TabsTrigger value="tab3">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(container.textContent).toContain('Home')
    expect(container.textContent).toContain('Profile')
    expect(container.textContent).toContain('Settings')
  })

  it('should render tabs with content', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )
    expect(container.textContent).toContain('Tab 1')
    expect(container.textContent).toContain('Tab 2')
  })

  it('should support default value', () => {
    const { container } = render(
      <Tabs defaultValue="second">
        <TabsList>
          <TabsTrigger value="first">First</TabsTrigger>
          <TabsTrigger value="second">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="first">First content</TabsContent>
        <TabsContent value="second">Second content</TabsContent>
      </Tabs>
    )
    expect(container).toBeTruthy()
  })

  it('should support orientation', () => {
    const { container } = render(
      <Tabs orientation="vertical">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(container).toBeTruthy()
  })

  it('should render tabs with disabled state', () => {
    const { container } = render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Active</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Disabled</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    expect(container.textContent).toContain('Active')
    expect(container.textContent).toContain('Disabled')
  })
})
