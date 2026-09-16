import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/locale/i18n', () => ({ default: { t: (k: string) => k, changeLanguage: vi.fn(), use: () => ({ init: vi.fn() }) } }))
vi.mock('@/components/AuditTimeline', () => ({ AuditTimeline: () => null }))
vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../datasection', () => ({ default: () => <div>rules-datasection</div> }))
vi.mock('../linksection', () => ({ default: () => <div>rules-linksection</div> }))
vi.mock('@/store/apis/auth/authentication.api', () => ({ useGetRuleQuery: () => ({ data: undefined, isLoading: false }), useGetSingleRuleQuery: () => ({ data: { id: 1, name: 'TestRule', permissions: [], is_archived: false }, isFetching: false }), useDeleteRuleMutation: () => [vi.fn(), { isLoading: false }], useDuplicateRuleMutation: () => [vi.fn(), { isLoading: false }], useArchiveRuleMutation: () => [vi.fn(), { isLoading: false }], useGetItemActivityLogQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/ItemActivityHistory', () => ({ ItemActivityHistory: () => null }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/', useSearchParams: () => ({ get: () => null }) }))

import RuleDetailPage from './page'

describe('RuleDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RuleDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
