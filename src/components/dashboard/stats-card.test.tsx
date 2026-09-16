import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Users } from 'lucide-react'
import { StatCard } from './stats-card'

describe('StatCard', () => {
  it('affiche le titre', () => {
    render(<StatCard title="Utilisateurs" value={42} description="actifs" icon={Users} />)
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument()
  })

  it('affiche la valeur', () => {
    render(<StatCard title="Total" value={99} description="items" icon={Users} />)
    expect(screen.getByText('99')).toBeInTheDocument()
  })

  it('affiche la description', () => {
    render(<StatCard title="T" value={0} description="ce mois-ci" icon={Users} />)
    expect(screen.getByText('ce mois-ci')).toBeInTheDocument()
  })

  it('rend sans valeur (undefined)', () => {
    const { container } = render(<StatCard title="T" value={undefined} description="desc" icon={Users} />)
    expect(container.firstChild).toBeTruthy()
  })
})
