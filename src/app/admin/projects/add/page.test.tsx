import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../ProjectForm', () => ({ default: () => <div>project-form</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import AddProjectPage from './page'

describe('AddProjectPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<AddProjectPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
