import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))
vi.mock('@/store/apis/core/project.api', () => ({
  useGetProjectsQuery: () => ({ data: undefined, isFetching: false }),
  useGetProjectCategoriesQuery: () => ({ data: undefined }),
}))

import RealisationsPageWrapper from './page'

describe('RealisationsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<RealisationsPageWrapper />)
    expect(container.firstChild).toBeTruthy()
  })
})
