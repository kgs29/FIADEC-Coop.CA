import { describe, it, expect } from 'vitest'
import { DEFAULT_CHART_COLORS, DEFAULT_DARK_CHART_COLORS } from './useStatsConfig'

describe('useStatsConfig constants', () => {
  it('DEFAULT_CHART_COLORS est un tableau de 10 éléments', () => {
    expect(DEFAULT_CHART_COLORS).toHaveLength(10)
  })

  it('DEFAULT_DARK_CHART_COLORS est un tableau de 10 éléments', () => {
    expect(DEFAULT_DARK_CHART_COLORS).toHaveLength(10)
  })

  it('tous les DEFAULT_CHART_COLORS sont des hex valides', () => {
    DEFAULT_CHART_COLORS.forEach(c => expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/))
  })

  it('tous les DEFAULT_DARK_CHART_COLORS sont des hex valides', () => {
    DEFAULT_DARK_CHART_COLORS.forEach(c => expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/))
  })
})
