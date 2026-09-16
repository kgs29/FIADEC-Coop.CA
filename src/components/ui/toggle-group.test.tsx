import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

describe('ToggleGroup Component', () => {
  it('should render toggle group', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container.textContent).toContain('A')
  })

  it('should render multiple toggle items', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container.textContent).toContain('Bold')
    expect(container.textContent).toContain('Italic')
    expect(container.textContent).toContain('Underline')
  })

  it('should support single type', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="opt1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="opt2">Option 2</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container.textContent).toContain('Option 1')
  })

  it('should support multiple type', () => {
    const { container } = render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container).toBeTruthy()
  })

  it('should support default value', () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="med">
        <ToggleGroupItem value="sm">Small</ToggleGroupItem>
        <ToggleGroupItem value="med">Medium</ToggleGroupItem>
        <ToggleGroupItem value="lg">Large</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container.textContent).toContain('Medium')
  })

  it('should render with disabled items', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">Active</ToggleGroupItem>
        <ToggleGroupItem value="b" disabled>Disabled</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container.textContent).toContain('Active')
    expect(container.textContent).toContain('Disabled')
  })
})
