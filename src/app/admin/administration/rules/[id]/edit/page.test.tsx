import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../../form', () => ({ default: () => <div>rule-form</div> }))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetSingleRuleQuery: () => ({ data: undefined, isFetching: false }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import EditRulePage from './page'

describe('EditRulePage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<EditRulePage />)
    expect(container.firstChild).toBeTruthy()
  })
})
