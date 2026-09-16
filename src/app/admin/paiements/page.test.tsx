import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./PaymentsStats', () => ({ default: () => <div>payments-stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('@/store/apis/payment/payment.api', () => ({ useGetAllPaymentsQuery: () => ({ data: undefined, isLoading: false, isFetching: false, refetch: vi.fn() }), useGetPaymentMethodsQuery: () => ({ data: undefined }) }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/', useSearchParams: () => ({ get: () => null }) }))
vi.mock('@/components/ui/pagination', () => ({ Pagination: ({ children }: any) => <div>{children}</div>, PaginationContent: ({ children }: any) => <div>{children}</div>, PaginationEllipsis: () => <span>...</span>, PaginationItem: ({ children }: any) => <div>{children}</div>, PaginationLink: ({ children }: any) => <a>{children}</a>, PaginationNext: ({ children }: any) => <a>{children}</a>, PaginationPrevious: ({ children }: any) => <a>{children}</a> }))
vi.mock('@/components/ui/select', () => ({ Select: ({ children }: any) => <div>{children}</div>, SelectContent: ({ children }: any) => <div>{children}</div>, SelectGroup: ({ children }: any) => <div>{children}</div>, SelectItem: ({ children }: any) => <div>{children}</div>, SelectTrigger: ({ children }: any) => <div>{children}</div>, SelectValue: () => null }))
vi.mock('@/components/ui/label', () => ({ Label: ({ children }: any) => <label>{children}</label> }))

import PaymentsPage from './page'

describe('PaymentsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<PaymentsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
