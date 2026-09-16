import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/payment/payment.api', () => ({ useCreatePaymentMutation: () => [vi.fn(), { isLoading: false }], useGetPaymentMethodsQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), useSearchParams: () => ({ get: () => null }) }))

import PaiementPage from './page'

describe('PaiementPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<PaiementPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
