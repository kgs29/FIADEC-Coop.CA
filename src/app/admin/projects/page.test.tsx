import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./ProjectDataSection', () => ({ default: () => <div>project-datasection</div> }))
vi.mock('./ProjectLinkSection', () => ({ default: () => null }))
vi.mock('./ProjectsStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import ProjectsPage from './page'

describe('ProjectsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ProjectsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
