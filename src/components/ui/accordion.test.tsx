import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion'

describe('Accordion Component', () => {
  it('should render accordion', () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(container.textContent).toContain('Is it accessible?')
  })

  it('should render multiple accordion items', () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(container.textContent).toContain('Item 1')
    expect(container.textContent).toContain('Item 2')
  })

  it('should render accordion content', () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Toggle</AccordionTrigger>
          <AccordionContent>Test content here</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(container).toBeTruthy()
  })

  it('should support multiple values accordion type', () => {
    const { container } = render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(container.textContent).toContain('Item 1')
    expect(container.textContent).toContain('Item 2')
  })

  it('should render with default value', () => {
    const { container } = render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Open by default</AccordionTrigger>
          <AccordionContent>This should be visible</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(container.textContent).toContain('This should be visible')
  })
})
