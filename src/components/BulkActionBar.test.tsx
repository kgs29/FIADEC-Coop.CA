import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BulkActionBar } from './BulkActionBar'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

const defaultActions = {
  onDelete: vi.fn(),
  onArchive: vi.fn(),
  onExportExcel: vi.fn(),
  onExportCsv: vi.fn(),
  onDuplicate: vi.fn(),
}

describe('BulkActionBar', () => {
  it('ne rend rien si selectedCount est 0', () => {
    const { container } = render(
      <BulkActionBar selectedCount={0} actions={defaultActions} onClear={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('affiche le compteur d\'éléments sélectionnés', () => {
    render(
      <BulkActionBar selectedCount={3} actions={defaultActions} onClear={vi.fn()} />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('affiche "élément sélectionné" au singulier', () => {
    render(
      <BulkActionBar selectedCount={1} actions={defaultActions} onClear={vi.fn()} />
    )
    expect(screen.getByText(/élément sélectionné/)).toBeInTheDocument()
  })

  it('affiche "éléments sélectionnés" au pluriel', () => {
    render(
      <BulkActionBar selectedCount={5} actions={defaultActions} onClear={vi.fn()} />
    )
    expect(screen.getByText(/éléments sélectionnés/)).toBeInTheDocument()
  })

  it('appelle onClear au clic sur le bouton de fermeture', () => {
    const onClear = vi.fn()
    render(
      <BulkActionBar selectedCount={2} actions={defaultActions} onClear={onClear} />
    )
    fireEvent.click(screen.getAllByRole('button').at(-1)!)
    // onClear peut être déclenché par différents boutons selon l'implémentation
    expect(onClear).toHaveBeenCalled()
  })

  it('désactive le bouton actions quand isLoading est true', () => {
    render(
      <BulkActionBar selectedCount={2} actions={defaultActions} onClear={vi.fn()} isLoading={true} />
    )
    const btn = screen.getByTitle('actions')
    expect(btn).toBeDisabled()
  })

  it('rend le composant avec selectedCount > 0', () => {
    render(
      <BulkActionBar selectedCount={4} actions={defaultActions} onClear={vi.fn()} />
    )
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
