import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div role="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
}))

import { ImportModal } from './ImportModal'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onImport: vi.fn().mockResolvedValue({ created: 0, errors: [] }),
  templateFields: ['nom', 'email'],
  resourceName: 'Utilisateurs',
}

describe('ImportModal', () => {
  it('rend sans erreur quand ouvert', () => {
    render(<ImportModal {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('n\'affiche rien quand fermé', () => {
    render(<ImportModal {...defaultProps} open={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('affiche le nom de la ressource', () => {
    render(<ImportModal {...defaultProps} />)
    expect(screen.getByText(/utilisateurs/i)).toBeInTheDocument()
  })
})
