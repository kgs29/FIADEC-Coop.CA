import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetSingleUserQuery: () => ({ data: undefined, error: null }),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useParams: () => ({ id: '123' }),
}))
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '@@i18next-react-i18next' },
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

import Page from './page'

describe('User Edit Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render user edit page', async () => {
    // Page is an async Server Component (Next.js 15 `params: Promise<...>` pattern),
    // so it must be resolved before its JSX can be passed to render().
    const jsx = await Page({ params: Promise.resolve({ id: '123' }) })
    const { container } = render(jsx)
    expect(container).toBeTruthy()
  })
})
