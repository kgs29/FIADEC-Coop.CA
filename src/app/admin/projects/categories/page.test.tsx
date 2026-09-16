import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./CategoryDataSection', () => ({ default: () => <div>category-datasection</div> }))
vi.mock('./CategoryLinkSection', () => ({ default: () => null }))
vi.mock('./CategoriesStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import CategoriesPage from './page'

describe('CategoriesPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<CategoriesPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
