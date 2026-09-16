import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))
vi.mock('@/store/apis/core/project.api', () => ({ useGetProjectsQuery: () => ({ data: undefined, isFetching: false }) }))
vi.mock('next/image', () => ({ default: (props: any) => <img {...props} /> }))

import NewsPage from './page'

describe('NewsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<NewsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
