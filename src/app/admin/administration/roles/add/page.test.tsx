import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../form', () => ({ default: () => <div>role-form</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import AddRolePage from './page'

describe('AddRolePage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<AddRolePage />)
    expect(container.firstChild).toBeTruthy()
  })
})
