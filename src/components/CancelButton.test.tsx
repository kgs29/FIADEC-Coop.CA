import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({ usePathname: () => '/admin/projects/add' }))
vi.mock('next/link', () => ({ default: ({ children, href, title }: { children: React.ReactNode, href: string, title?: string }) => <a href={href} title={title}>{children}</a> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('@/utils/breackcrumbs-config', () => ({ generateBreadcrumbs: () => [{ path: '/admin', label: 'Admin' }, { path: '/admin/projects', label: 'Projects' }] }))

import CancelButton from './CancelButton'

describe('CancelButton', () => {
  it('rend un lien', () => {
    render(<CancelButton />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('affiche le message personnalisé si fourni', () => {
    render(<CancelButton message="Retour" />)
    expect(screen.getByTitle('Retour')).toBeInTheDocument()
  })

  it('utilise le chemin personnalisé si fourni', () => {
    render(<CancelButton path="/custom-path" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/custom-path')
  })
})
