import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/payment/order.api', () => ({ useGetOrdersQuery: () => ({ data: undefined, isLoading: false }), useGetMyOrdersQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

import OrdersPage from './page'

describe('OrdersPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<OrdersPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
