import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('@/components/TableSearchInput', () => ({
  TableSearchInput: ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <input role="textbox" value={value} onChange={e => onChange(e.target.value)} />
  ),
}))

import { StatsTabLayout } from './StatsTabLayout'

// StatsTabLayout clones `children`/`statsPanel` with onFiltersChange/externalSearch/
// filterQuery props, meant for a real DataSection component. A plain <div> would
// receive those as unknown DOM attributes, so use a slot that just ignores them.
const Slot = ({ children }: any) => <div>{children}</div>

describe('StatsTabLayout', () => {
  it('rend sans erreur', () => {
    const { container } = render(
      <StatsTabLayout statsPanel={<Slot>stats</Slot>}>
        <Slot>table-content</Slot>
      </StatsTabLayout>
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('affiche le contenu table par défaut', () => {
    render(
      <StatsTabLayout statsPanel={<Slot>stats</Slot>}>
        <Slot>table-content</Slot>
      </StatsTabLayout>
    )
    expect(screen.getByText('table-content')).toBeInTheDocument()
  })

  it('bascule vers l\'onglet stats au clic', () => {
    render(
      <StatsTabLayout statsPanel={<Slot>stats-panel</Slot>}>
        <Slot>table-content</Slot>
      </StatsTabLayout>
    )
    const statsBtns = screen.getAllByRole('button')
    const statsBtn = statsBtns[1]
    fireEvent.click(statsBtn)
    expect(screen.getByText('stats-panel')).toBeInTheDocument()
  })

  it('affiche le contenu aboveSearch', () => {
    render(
      <StatsTabLayout statsPanel={<Slot>stats</Slot>} aboveSearch={<span>titre</span>}>
        <Slot>content</Slot>
      </StatsTabLayout>
    )
    expect(screen.getByText('titre')).toBeInTheDocument()
  })
})
