import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/admin/administration/rules',
  useSearchParams: () => ({ get: () => null }),
}))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetRulesQuery: () => ({ data: undefined, isLoading: false, isFetching: false }),
  useDeleteRuleMutation: () => [vi.fn(), { isLoading: false }],
  useArchiveRuleMutation: () => [vi.fn(), { isLoading: false }],
  useUnarchiveRuleMutation: () => [vi.fn(), { isLoading: false }],
  useDuplicateRuleMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import RulesDataSection from './datasection'

describe('RulesDataSection', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RulesDataSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
