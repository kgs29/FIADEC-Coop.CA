import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

import AccountsPage from './page'

describe('AccountsPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<AccountsPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
