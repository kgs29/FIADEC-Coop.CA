import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('./newsletter-content-page', () => ({ default: () => <div>newsletter-content</div> }))
vi.mock('./NewsletterStats', () => ({ default: () => <div>stats</div> }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import NewsletterPage from './page'

describe('NewsletterPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<NewsletterPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
