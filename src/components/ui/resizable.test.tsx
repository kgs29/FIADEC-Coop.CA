import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'

describe('Resizable', () => {
  it('ResizablePanelGroup rend sans erreur', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div>Panel 1</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div>Panel 2</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(container.firstChild).toBeTruthy()
  })
})
