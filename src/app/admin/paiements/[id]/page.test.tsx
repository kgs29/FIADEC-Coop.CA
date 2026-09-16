import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/store/apis/payment/payment.api', () => ({
  useGetPaymentQuery: () => ({ data: undefined, isLoading: false }),
  useAdminConfirmPaymentMutation: () => [vi.fn(), { isLoading: false }],
  useAdminRejectPaymentMutation: () => [vi.fn(), { isLoading: false }],
  useAdminRefundPaymentMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import PaymentDetailPage from './page'

describe('PaymentDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<PaymentDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
