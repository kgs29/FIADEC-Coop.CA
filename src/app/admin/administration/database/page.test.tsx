import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('./database-content', () => ({ default: () => <div>database-content</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import DatabasePage from './page'

describe('DatabasePage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<DatabasePage />)
    expect(container.firstChild).toBeTruthy()
  })
})
