import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))
vi.mock('next/navigation', () => ({ usePathname: () => '/admin/projects/categories' }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))

import CategoryLinkSection from './CategoryLinkSection'

describe('CategoryLinkSection', () => {
  it('rend sans erreur', () => {
    const { container } = render(<CategoryLinkSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
