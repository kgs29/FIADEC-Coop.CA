import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./datasection', () => ({ default: () => <div>roles-datasection</div> }))
vi.mock('./linksection', () => ({ default: () => null }))
vi.mock('./RolesStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import RolesPage from './page'

describe('RolesPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RolesPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
