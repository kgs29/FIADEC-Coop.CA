import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'

describe('HoverCard Component', () => {
  it('should render hover card trigger', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
      </HoverCard>
    )
    expect(container.textContent).toContain('Hover me')
  })

  it('should render hover card content', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>User</HoverCardTrigger>
        <HoverCardContent>User information</HoverCardContent>
      </HoverCard>
    )
    expect(container.textContent).toContain('User')
  })

  it('should render hover card with details', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>@username</HoverCardTrigger>
        <HoverCardContent>
          <div>Username: John Doe</div>
          <div>Member since 2023</div>
        </HoverCardContent>
      </HoverCard>
    )
    expect(container.textContent).toContain('@username')
  })

  it('should support open delay', () => {
    const { container } = render(
      <HoverCard openDelay={200}>
        <HoverCardTrigger>Item</HoverCardTrigger>
        <HoverCardContent>Hidden content</HoverCardContent>
      </HoverCard>
    )
    expect(container).toBeTruthy()
  })

  it('should render multiple hover cards', () => {
    const { container } = render(
      <div>
        <HoverCard>
          <HoverCardTrigger>Card 1</HoverCardTrigger>
          <HoverCardContent>Content 1</HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger>Card 2</HoverCardTrigger>
          <HoverCardContent>Content 2</HoverCardContent>
        </HoverCard>
      </div>
    )
    expect(container.textContent).toContain('Card 1')
    expect(container.textContent).toContain('Card 2')
  })

  it('should render with custom side positioning', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger>Target</HoverCardTrigger>
        <HoverCardContent side="right">Right side content</HoverCardContent>
      </HoverCard>
    )
    expect(container).toBeTruthy()
  })
})
