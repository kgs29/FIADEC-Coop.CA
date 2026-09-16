import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./datasection', () => ({ default: () => <div>rules-datasection</div> }))
vi.mock('./linksection', () => ({ default: () => null }))
vi.mock('./RulesStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import RulesPage from './page'

describe('RulesPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RulesPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
