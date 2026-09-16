import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../../ProjectForm', () => ({ default: () => <div>project-form</div> }))
vi.mock('@/store/apis/core/project.api', () => ({ useGetProjectQuery: () => ({ data: undefined, isLoading: false }) }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/navigation', () => ({ useParams: () => ({ id: '1' }), useRouter: () => ({ push: vi.fn() }) }))

import EditProjectPage from './page'

describe('EditProjectPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<EditProjectPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
