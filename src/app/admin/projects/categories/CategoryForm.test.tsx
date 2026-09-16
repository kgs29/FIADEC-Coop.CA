import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/store/apis/core/project.api', () => ({
  useCreateProjectCategoryMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateProjectCategoryMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), back: vi.fn() }), usePathname: () => '/' }))
vi.mock('@/components/CancelButton', () => ({ default: ({ onClick }: any) => <button onClick={onClick}>Cancel</button> }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))

import CategoryForm from './CategoryForm'

describe('CategoryForm', () => {
  it('rend sans erreur (mode création)', () => {
    render(<CategoryForm mode="create" />)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
