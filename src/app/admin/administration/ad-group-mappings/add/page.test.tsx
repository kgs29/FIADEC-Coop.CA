import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../form', () => ({ default: () => <div>ad-group-form</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import AddADGroupMappingPage from './page'

describe('AddADGroupMappingPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<AddADGroupMappingPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
