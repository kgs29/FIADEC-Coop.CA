import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../CategoryForm', () => ({ default: () => <div>category-form</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import AddCategoryPage from './page'

describe('AddCategoryPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<AddCategoryPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
