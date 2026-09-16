import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div role="alertdialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
}))
vi.mock('@/components/ui/loading-btn', () => ({
  LoadingButton: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

import { DeleteConfirmDialog } from './delete-confirm-dialog'

describe('DeleteConfirmDialog', () => {
  it('rend sans erreur quand ouvert', () => {
    render(<DeleteConfirmDialog open={true} onConfirm={vi.fn()} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('alertdialog')).toBeTruthy()
  })

  it('n\'affiche rien quand fermé', () => {
    render(<DeleteConfirmDialog open={false} onConfirm={vi.fn()} onOpenChange={vi.fn()} />)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('appelle onConfirm lors de la confirmation', () => {
    const onConfirm = vi.fn()
    render(<DeleteConfirmDialog open={true} onConfirm={onConfirm} onOpenChange={vi.fn()} />)
    fireEvent.click(screen.getByText('delete'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('appelle onOpenChange(false) lors de l\'annulation', () => {
    const onOpenChange = vi.fn()
    render(<DeleteConfirmDialog open={true} onConfirm={vi.fn()} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByText('cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
