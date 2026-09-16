import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('./configuration-content', () => ({ default: () => <div>config-content</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import ConfigurationPage from './page'

describe('ConfigurationPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ConfigurationPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
