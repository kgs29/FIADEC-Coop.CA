import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./contacts-content-page', () => ({ default: () => <div>contacts-content</div> }))
vi.mock('./ContactsStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import ContactsPage from './page'

describe('ContactsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ContactsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
