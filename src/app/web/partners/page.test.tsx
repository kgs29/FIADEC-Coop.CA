import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

import PartnersPage from './page'

describe('PartnersPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<PartnersPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
