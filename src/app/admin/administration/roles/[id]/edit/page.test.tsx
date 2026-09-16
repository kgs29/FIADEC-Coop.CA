import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../../form', () => ({ default: () => <div>role-form</div> }))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetSingleRoleQuery: () => ({ data: undefined, isFetching: false }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import EditRolePage from './page'

describe('EditRolePage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<EditRolePage />)
    expect(container.firstChild).toBeTruthy()
  })
})
