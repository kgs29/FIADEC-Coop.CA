import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

import CareersPage from './page'

describe('CareersPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<CareersPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
