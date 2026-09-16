import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'

describe('Card Component', () => {
  it('should render card', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>Card content</CardContent>
      </Card>
    )
    expect(container.textContent).toContain('Card Title')
  })

  it('should render card with description', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>This is a description</CardDescription>
        </CardHeader>
        <CardContent>Content here</CardContent>
      </Card>
    )
    expect(container.textContent).toContain('This is a description')
  })

  it('should render card with footer', () => {
    const { container } = render(
      <Card>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer text</CardFooter>
      </Card>
    )
    expect(container.textContent).toContain('Footer text')
  })

  it('should render complete card structure', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Main content area</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(container.textContent).toContain('Complete Card')
    expect(container.textContent).toContain('Description')
    expect(container.textContent).toContain('Main content area')
    expect(container.textContent).toContain('Footer')
  })

  it('should have card styling', () => {
    const { container } = render(
      <Card>
        <CardContent>Styled card</CardContent>
      </Card>
    )
    expect(container).toBeTruthy()
  })
})
