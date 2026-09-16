import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/locale/i18n', () => ({ default: { t: (k: string) => k, changeLanguage: vi.fn(), use: () => ({ init: vi.fn() }) } }))
vi.mock('@/components/AuditTimeline', () => ({ AuditTimeline: () => null }))
vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../datasection', () => ({ default: () => <div>ad-datasection</div> }))
vi.mock('../linksection', () => ({ default: () => <div>ad-linksection</div> }))
vi.mock('@/store/apis/auth/authentication.api', () => ({ useGetADGroupMappingQuery: () => ({ data: undefined, isLoading: false }), useGetSingleADGroupMappingQuery: () => ({ data: { id: 1, ad_group_name: 'TestGroup', role: 1, is_archived: false }, isFetching: false }), useDeleteADGroupMappingMutation: () => [vi.fn(), { isLoading: false }], useArchiveADGroupMappingMutation: () => [vi.fn(), { isLoading: false }], useUnarchiveADGroupMappingMutation: () => [vi.fn(), { isLoading: false }], useDuplicateADGroupMappingMutation: () => [vi.fn(), { isLoading: false }], useGetItemActivityLogQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/ItemActivityHistory', () => ({ ItemActivityHistory: () => null }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/', useSearchParams: () => ({ get: () => null }) }))

import ADGroupMappingDetailPage from './page'

describe('ADGroupMappingDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ADGroupMappingDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
