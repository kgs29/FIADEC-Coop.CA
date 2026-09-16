import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/store/apis/payment/order.api', () => ({
  useCreateOrderMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('@/store/apis/payment/payment.api', () => ({
  useGetPaymentMethodsQuery: () => ({ data: undefined }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import PurchaseModal from './PurchaseModal'

const mockProject = {
  id: 1, name: 'Projet test', description: '', price: 100,
  category: null, is_active: true, created_at: '', updated_at: '',
}

describe('PurchaseModal', () => {
  it('n\'affiche rien quand fermé', () => {
    render(<PurchaseModal open={false} onClose={vi.fn()} project={mockProject as unknown} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('rend le modal quand ouvert', () => {
    const { container } = render(<PurchaseModal open={true} onClose={vi.fn()} project={mockProject as unknown} />)
    expect(container.firstChild).toBeTruthy()
  })
})
