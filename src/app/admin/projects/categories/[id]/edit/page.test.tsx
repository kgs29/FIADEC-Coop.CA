import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../../CategoryForm', () => ({ default: () => <div>category-form</div> }))
vi.mock('@/store/apis/core/project.api', () => ({ useGetProjectCategoryQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }) }))

import EditCategoryPage from './page'

describe('EditCategoryPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<EditCategoryPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
