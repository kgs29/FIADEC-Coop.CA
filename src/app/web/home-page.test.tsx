import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <img alt={alt} /> }))
vi.mock('@/store/apis/core/project.api', () => ({
  useGetProjectsQuery: () => ({ data: undefined, isLoading: false }),
  useGetProjectCategoriesQuery: () => ({ data: undefined }),
}))

import HomePage from './home-page'

describe('HomePage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<HomePage />)
    expect(container.firstChild).toBeTruthy()
  })
})
