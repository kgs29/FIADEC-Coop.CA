import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

import DatabaseContent from './database-content'

describe('DatabaseContent', () => {
  it('rend sans erreur', () => {
    const { container } = render(<DatabaseContent />)
    expect(container.firstChild).toBeTruthy()
  })
})
