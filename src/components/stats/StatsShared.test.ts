import { describe, it, expect } from 'vitest'
import { buildStatsQuery, CHART_COLORS, TICK_STYLE, TOOLTIP_PROPS } from './StatsShared'

describe('StatsShared utilities', () => {
  describe('buildStatsQuery', () => {
    it('ajoute size=500 et page=0', () => {
      const result = buildStatsQuery('')
      expect(result).toContain('size=500')
      expect(result).toContain('page=0')
    })

    it('supprime le paramètre page existant et ajoute page=0', () => {
      const result = buildStatsQuery('page=3&search=foo')
      expect(result).not.toContain('page=3')
      expect(result).toContain('page=0')
    })

    it('préserve le paramètre search', () => {
      const result = buildStatsQuery('search=test')
      expect(result).toContain('search=test')
    })
  })

  it('CHART_COLORS contient 10 couleurs hex', () => {
    expect(CHART_COLORS).toHaveLength(10)
    CHART_COLORS.forEach(c => expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/))
  })

  it('TICK_STYLE a une propriété fontSize', () => {
    expect(TICK_STYLE.fontSize).toBe(11)
  })

  it('TOOLTIP_PROPS a un contentStyle', () => {
    expect(TOOLTIP_PROPS.contentStyle).toBeDefined()
    expect(typeof TOOLTIP_PROPS.contentStyle.borderRadius).toBe('number')
  })
})
