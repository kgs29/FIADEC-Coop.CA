import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetADGroupMappingsQuery: () => ({ data: undefined, isLoading: false }),
  useDeleteADGroupMappingMutation: () => [vi.fn(), { isLoading: false }],
  useArchiveADGroupMappingMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/admin/administration/ad-group-mappings',
  useSearchParams: () => ({ get: () => null }),
}))
vi.mock('@/hooks/redux-toolkit', () => ({ useAppSelector: () => ({ auth: { user: { is_superuser: false, is_staff: false, groups: [] } } }) }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import ADGroupMappingsDataSection from './datasection'

describe('ADGroupMappingsDataSection', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ADGroupMappingsDataSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
