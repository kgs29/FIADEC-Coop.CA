import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/constants/env', () => ({ EMAIL_ADDRESS: 'test@example.com', PHONE: '+237 000', LOCATION: 'Yaoundé' }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import ContactUsPage from './page'

describe('ContactUsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ContactUsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
