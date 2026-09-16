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
}))
vi.mock('@/store/apis/payment/payment.api', () => ({
  useGetAllPaymentsQuery: () => ({ data: undefined }),
  useAdminConfirmPaymentMutation: () => [vi.fn(), {}],
  useAdminRejectPaymentMutation: () => [vi.fn(), {}],
  useAdminRefundPaymentMutation: () => [vi.fn(), {}],
}))
vi.mock('@/store/apis/payment/order.api', () => ({
  useGetAllOrdersQuery: () => ({ data: undefined }),
  useConfirmOrderMutation: () => [vi.fn(), {}],
}))
vi.mock('@/components/dashboard/stats-card', () => ({ StatCard: ({ title }: { title: string }) => <div>{title}</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import PaymentsStats from './PaymentsStats'

describe('PaymentsStats', () => {
  it('rend sans erreur', () => {
    const { container } = render(<PaymentsStats />)
    expect(container.firstChild).toBeTruthy()
  })
})
