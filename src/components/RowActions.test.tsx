import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
}))

import { RowActions } from './RowActions'

describe('RowActions', () => {
  it('rend le déclencheur du menu', () => {
    render(<RowActions actions={[]} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('affiche les items du menu', () => {
    render(<RowActions actions={[{ label: 'Voir', onClick: vi.fn() }]} />)
    expect(screen.getByText('Voir')).toBeInTheDocument()
  })

  it('appelle onClick lors d\'un clic sur un item', () => {
    const onClick = vi.fn()
    render(<RowActions actions={[{ label: 'Action', onClick }]} />)
    screen.getByText('Action').click()
    expect(onClick).toHaveBeenCalled()
  })

  it('affiche les liens avec href', () => {
    render(<RowActions actions={[{ label: 'Éditer', href: '/edit/1' }]} />)
    expect(screen.getByRole('link', { name: 'Éditer' })).toHaveAttribute('href', '/edit/1')
  })
})
