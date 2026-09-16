import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../form', () => ({ default: () => <div>rule-form</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import AddRulePage from './page'

describe('AddRulePage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<AddRulePage />)
    expect(container.firstChild).toBeTruthy()
  })
})
