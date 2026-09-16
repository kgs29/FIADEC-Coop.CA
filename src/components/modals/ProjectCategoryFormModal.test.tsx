import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/store/apis/core/project.api', () => ({
  useCreateProjectCategoryMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import ProjectCategoryFormModal from './ProjectCategoryFormModal'

describe('ProjectCategoryFormModal', () => {
  it('rend le formulaire', () => {
    render(<ProjectCategoryFormModal onCreated={vi.fn()} onClose={vi.fn()} />)
    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThan(0)
  })

  it('affiche le bouton de soumission', () => {
    render(<ProjectCategoryFormModal onCreated={vi.fn()} onClose={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
