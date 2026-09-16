import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/hooks/useStatsConfig', () => ({
  useStatsConfig: () => ({ isVisible: () => true, toggle: vi.fn(), getChartColor: () => '#000', setChartColor: vi.fn(), isLoading: false, hiddenCount: 0, config: {}, colors: [] }),
}))
vi.mock('@/hooks/useIsDark', () => ({ useIsDark: () => false }))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  AuthenticationApi: { util: { updateQueryData: vi.fn() } },
  useGetStatsConfigQuery: () => ({ data: undefined }),
  useUpdateStatsConfigMutation: () => [vi.fn(), {}],
  useGetRulesQuery: () => ({ data: undefined }),
}))
vi.mock('@/components/dashboard/stats-card', () => ({ StatCard: ({ title }: { title: string }) => <div>{title}</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import RulesStats from './RulesStats'

describe('RulesStats', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RulesStats />)
    expect(container.firstChild).toBeTruthy()
  })
})
