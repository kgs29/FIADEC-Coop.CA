import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./datasection', () => ({ default: () => <div>ad-datasection</div> }))
vi.mock('./linksection', () => ({ default: () => null }))
vi.mock('./ADGroupMappingsStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import ADGroupMappingsPage from './page'

describe('ADGroupMappingsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ADGroupMappingsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
