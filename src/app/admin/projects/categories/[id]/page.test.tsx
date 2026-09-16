import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/locale/i18n', () => ({ default: { t: (k: string) => k, changeLanguage: vi.fn(), use: () => ({ init: vi.fn() }) } }))
vi.mock('@/components/AuditTimeline', () => ({ AuditTimeline: () => null }))
vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../CategoryDataSection', () => ({ default: () => <div>cat-datasection</div> }))
vi.mock('../CategoryLinkSection', () => ({ default: () => <div>cat-linksection</div> }))
vi.mock('@/store/apis/core/project.api', () => ({ useGetProjectCategoryQuery: () => ({ data: { id: 1, name: 'Test Category', is_archived: false }, isLoading: false }), useArchiveProjectCategoryMutation: () => [vi.fn(), { isLoading: false }], useDeleteProjectCategoryMutation: () => [vi.fn(), { isLoading: false }], useDuplicateProjectCategoryMutation: () => [vi.fn(), { isLoading: false }], useGetItemActivityLogQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/ItemActivityHistory', () => ({ ItemActivityHistory: () => null }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/', useSearchParams: () => ({ get: () => null }) }))

import CategoryDetailPage from './page'

describe('CategoryDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<CategoryDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
