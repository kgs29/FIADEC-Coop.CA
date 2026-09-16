import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./devices-content-page', () => ({ default: () => <div>devices-content</div> }))
vi.mock('./DevicesStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import DevicesPage from './page'

describe('DevicesPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<DevicesPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
