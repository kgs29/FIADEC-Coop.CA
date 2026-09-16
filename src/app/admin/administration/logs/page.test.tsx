import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./logs-content-page', () => ({ default: () => <div>logs-content</div> }))
vi.mock('./LogsStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import LogsPage from './page'

describe('LogsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<LogsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
