import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

import FaqPage from './page'

describe('FaqPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<FaqPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
