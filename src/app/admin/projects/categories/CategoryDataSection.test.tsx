import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/admin/projects/categories',
  useSearchParams: () => ({ get: () => null }),
}))
vi.mock('@/store/apis/core/project.api', () => ({
  useGetProjectCategoriesQuery: () => ({ data: undefined, isLoading: false, isFetching: false }),
  useDeleteProjectCategoryMutation: () => [vi.fn(), { isLoading: false }],
  useArchiveProjectCategoryMutation: () => [vi.fn(), { isLoading: false }],
  useDuplicateProjectCategoryMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import CategoryDataSection from './CategoryDataSection'

describe('CategoryDataSection', () => {
  it('rend sans erreur', () => {
    const { container } = render(<CategoryDataSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
