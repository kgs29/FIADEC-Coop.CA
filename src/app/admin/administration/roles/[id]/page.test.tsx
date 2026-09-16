import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/locale/i18n', () => ({ default: { t: (k: string) => k, changeLanguage: vi.fn(), use: () => ({ init: vi.fn() }) } }))
vi.mock('@/components/AuditTimeline', () => ({ AuditTimeline: () => null }))
vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../datasection', () => ({ default: () => <div>roles-datasection</div> }))
vi.mock('../linksection', () => ({ default: () => <div>roles-linksection</div> }))
vi.mock('@/store/apis/auth/authentication.api', () => ({ useGetRoleQuery: () => ({ data: undefined, isLoading: false }), useGetSingleRoleQuery: () => ({ data: { id: 1, name: 'TestRole', groups: [], users_count: 0, is_archived: false }, isFetching: false }), useDeleteRoleMutation: () => [vi.fn(), { isLoading: false }], useArchiveRoleMutation: () => [vi.fn(), { isLoading: false }], useUnarchiveRoleMutation: () => [vi.fn(), { isLoading: false }], useDuplicateRoleMutation: () => [vi.fn(), { isLoading: false }], useGetItemActivityLogQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/ItemActivityHistory', () => ({ ItemActivityHistory: () => null }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/', useSearchParams: () => ({ get: () => null }) }))

import RoleDetailPage from './page'

describe('RoleDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RoleDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
