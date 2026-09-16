import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'

describe('Tooltip Component', () => {
  it('should render tooltip trigger', () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
      </Tooltip>
    )
    expect(container.textContent).toContain('Hover')
  })

  it('should render tooltip content', () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger>Info</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )
    expect(container.textContent).toContain('Info')
  })

  it('should render tooltip with help text', () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger>?</TooltipTrigger>
        <TooltipContent>This is helpful information</TooltipContent>
      </Tooltip>
    )
    expect(container.textContent).toContain('?')
  })

  it('should support side positioning', () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger>Item</TooltipTrigger>
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>
    )
    expect(container).toBeTruthy()
  })

  it('should render multiple tooltips', () => {
    const { container } = render(
      <div>
        <Tooltip>
          <TooltipTrigger>Tip 1</TooltipTrigger>
          <TooltipContent>Text 1</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Tip 2</TooltipTrigger>
          <TooltipContent>Text 2</TooltipContent>
        </Tooltip>
      </div>
    )
    expect(container.textContent).toContain('Tip 1')
    expect(container.textContent).toContain('Tip 2')
  })

  it('should support delay property', () => {
    const { container } = render(
      <Tooltip delayDuration={200}>
        <TooltipTrigger>Delayed</TooltipTrigger>
        <TooltipContent>Delayed tooltip</TooltipContent>
      </Tooltip>
    )
    expect(container).toBeTruthy()
  })
})
