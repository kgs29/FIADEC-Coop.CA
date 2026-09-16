import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/locale/i18n', () => ({ default: { t: (k: string) => k, changeLanguage: vi.fn(), use: () => ({ init: vi.fn() }) } }))
vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../ProjectDataSection', () => ({ default: () => <div>project-datasection</div> }))
vi.mock('../ProjectLinkSection', () => ({ default: () => <div>project-linksection</div> }))
vi.mock('@/store/apis/core/project.api', () => ({ useGetProjectQuery: () => ({ data: { id: 1, title: 'Test Project', is_archived: false, is_published: false }, isLoading: false }), usePublishProjectMutation: () => [vi.fn(), { isLoading: false }], useArchiveProjectMutation: () => [vi.fn(), { isLoading: false }], useDeleteProjectMutation: () => [vi.fn(), { isLoading: false }], useDuplicateProjectMutation: () => [vi.fn(), { isLoading: false }], useGetItemActivityLogQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/ItemActivityHistory', () => ({ ItemActivityHistory: () => null }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/', useSearchParams: () => ({ get: () => null }) }))

import ProjectDetailPage from './page'

describe('ProjectDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ProjectDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
