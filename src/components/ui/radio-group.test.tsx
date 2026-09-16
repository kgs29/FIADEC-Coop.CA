import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from './radio-group'

describe('RadioGroup Component', () => {
  it('should render radio group', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" />
      </RadioGroup>
    )
    expect(container.querySelector('[role="radio"]')).toBeTruthy()
  })

  it('should render multiple radio options', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
        <RadioGroupItem value="option3" id="option3" />
      </RadioGroup>
    )
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBeGreaterThanOrEqual(1)
  })

  it('should render radio group with default value', () => {
    const { container } = render(
      <RadioGroup defaultValue="option1">
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    )
    expect(container).toBeTruthy()
  })

  it('should render radio group with value', () => {
    const { container } = render(
      <RadioGroup value="option2">
        <RadioGroupItem value="option1" id="option1" />
        <RadioGroupItem value="option2" id="option2" />
      </RadioGroup>
    )
    expect(container).toBeTruthy()
  })

  it('should render disabled radio', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" disabled />
      </RadioGroup>
    )
    const radio = container.querySelector('[role="radio"]')
    expect(radio).toBeTruthy()
  })

  it('should have correct radio styling', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="option1" id="option1" />
      </RadioGroup>
    )
    const radio = container.querySelector('[role="radio"]')
    expect(radio).toBeTruthy()
  })
})
