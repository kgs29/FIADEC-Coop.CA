import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/payment/order.api', () => ({
  useGetOrderQuery: () => ({ data: undefined, isLoading: false }),
  useCancelOrderMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import OrderDetailPage from './page'

describe('OrderDetailPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<OrderDetailPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
