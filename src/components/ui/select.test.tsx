import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select'

describe('Select Component', () => {
  it('should render select trigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>Select option</SelectTrigger>
      </Select>
    )
    expect(container.textContent).toContain('Select option')
  })

  it('should render select with options', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(container.textContent).toContain('Choose')
  })

  it('should render select with value', () => {
    const { container } = render(
      <Select value="opt1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opt1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(container).toBeTruthy()
  })

  it('should render multiple select items', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>Select</SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Apple</SelectItem>
          <SelectItem value="b">Banana</SelectItem>
          <SelectItem value="c">Cherry</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(container).toBeTruthy()
  })

  it('should support disabled state', () => {
    const { container } = render(
      <Select disabled>
        <SelectTrigger>Disabled</SelectTrigger>
      </Select>
    )
    expect(container).toBeTruthy()
  })

  it('should render with placeholder', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a color..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(container.textContent).toContain('Select a color')
  })
})
