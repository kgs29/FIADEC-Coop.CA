import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/core/project.api', () => ({
  useCreateProjectMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateProjectMutation: () => [vi.fn(), { isLoading: false }],
  useGetProjectCategoriesQuery: () => ({ data: undefined }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), back: vi.fn() }), usePathname: () => '/' }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('@/components/editor-component', () => ({ default: () => <div data-testid="editor" /> }))
vi.mock('@/components/modals/ProjectCategoryFormModal', () => ({ default: () => null }))
vi.mock('@/components/CancelButton', () => ({ default: ({ onClick }: any) => <button onClick={onClick}>Cancel</button> }))
vi.mock('@/utils/navigate-back', () => ({ useNavigateBack: () => vi.fn() }))
vi.mock('@/components/ui/ComboboxField', () => ({ default: () => null }))

import ProjectForm from './ProjectForm'

describe('ProjectForm', () => {
  it('rend sans erreur (mode création)', () => {
    const { container } = render(<ProjectForm mode="create" />)
    expect(container.firstChild).toBeTruthy()
  })
})
