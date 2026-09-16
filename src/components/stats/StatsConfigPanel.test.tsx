import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/hooks/useStatsConfig', () => ({
  useStatsConfig: () => ({
    isVisible: () => true,
    toggle: vi.fn(),
    getChartColor: () => '#6366f1',
    setChartColor: vi.fn(),
    hiddenCount: 0,
  }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import { StatsConfigPanel } from './StatsConfigPanel'

describe('StatsConfigPanel', () => {
  it('rend sans erreur', () => {
    const { container } = render(
      <StatsConfigPanel module="test" charts={[{ id: 'chart1', label: 'Graphique 1' }]} />
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('affiche le bouton de configuration', () => {
    render(<StatsConfigPanel module="test" charts={[]} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('ouvre le panneau au clic', () => {
    render(<StatsConfigPanel module="test" charts={[{ id: 'chart1', label: 'Graphique 1' }]} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Graphique 1')).toBeInTheDocument()
  })
})
