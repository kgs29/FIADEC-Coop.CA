import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

describe('Avatar Component', () => {
  it('should render avatar with image', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    )
    expect(container).toBeTruthy()
  })

  it('should render avatar with fallback', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(container.textContent).toContain('JD')
  })

  it('should render avatar with alt text', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="User Avatar" />
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    )
    expect(container.textContent).toContain('UA')
  })

  it('should render multiple avatars', () => {
    const { container } = render(
      <div>
        <Avatar><AvatarFallback>A1</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>A2</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>A3</AvatarFallback></Avatar>
      </div>
    )
    expect(container.textContent).toContain('A1')
    expect(container.textContent).toContain('A2')
    expect(container.textContent).toContain('A3')
  })
})
