import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { AlertCircle } from 'lucide-react'

describe('Alert Component', () => {
  it('should render alert', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    )
    expect(container.textContent).toContain('Alert Title')
  })

  it('should render alert with icon', () => {
    const { container } = render(
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    )
    expect(container.textContent).toContain('Error')
  })

  it('should support different variants', () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Destructive Alert</AlertTitle>
      </Alert>
    )
    const alert = container.querySelector('[role="alert"]')
    expect(alert?.className).toContain('destructive')
  })

  it('should render alert title and description', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title Test</AlertTitle>
        <AlertDescription>Description Test</AlertDescription>
      </Alert>
    )
    expect(container.textContent).toContain('Title Test')
    expect(container.textContent).toContain('Description Test')
  })

  it('should render alert with multiple lines of text', () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Multi-line Alert</AlertTitle>
        <AlertDescription>
          This is a longer description that spans multiple lines and provides more context about the alert.
        </AlertDescription>
      </Alert>
    )
    expect(container.textContent).toContain('Multi-line Alert')
  })
})
