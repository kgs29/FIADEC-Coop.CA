import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }),
  });
});

import { SidebarProvider, Sidebar } from './sidebar'

describe('Sidebar UI component', () => {
  it('rend sans erreur', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar><div>sidebar content</div></Sidebar>
      </SidebarProvider>
    )
    expect(container.firstChild).toBeTruthy()
  })
})
