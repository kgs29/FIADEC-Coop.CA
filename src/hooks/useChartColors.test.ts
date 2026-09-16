import { describe, it, expect, vi } from 'vitest'

vi.mock('@/hooks/useIsDark', () => ({ useIsDark: () => false }))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetStatsConfigQuery: () => ({ data: undefined }),
}))

import { useChartColors } from './useChartColors'
import { DEFAULT_CHART_COLORS, DEFAULT_DARK_CHART_COLORS } from './useStatsConfig'

describe('useChartColors', () => {
  it('retourne les couleurs par défaut quand aucune config', () => {
    const colors = useChartColors()
    expect(colors).toEqual(DEFAULT_CHART_COLORS)
  })

  it('DEFAULT_CHART_COLORS contient 10 couleurs', () => {
    expect(DEFAULT_CHART_COLORS).toHaveLength(10)
  })

  it('DEFAULT_DARK_CHART_COLORS contient 10 couleurs', () => {
    expect(DEFAULT_DARK_CHART_COLORS).toHaveLength(10)
  })

  it('les couleurs sont des codes hex valides', () => {
    DEFAULT_CHART_COLORS.forEach(c => {
      expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})
