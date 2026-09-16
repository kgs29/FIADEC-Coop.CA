import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetPermissionsQuery: () => ({ data: [], isFetching: false }),
  useCreateRuleMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateRuleMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import RuleForm from './form'

describe('RuleForm', () => {
  it('rend sans erreur (mode création)', () => {
    render(<RuleForm mode="create" />)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
