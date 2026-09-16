import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))
vi.mock('next/navigation', () => ({ usePathname: () => '/admin' }))
vi.mock('@/lib/PermissionGuard', () => ({ default: ({ children }: any) => <>{children}</> }))
vi.mock('@/components/ImportModal', () => ({ ImportModal: () => null }))
vi.mock('@/lib/bulkApi', () => ({ importFile: vi.fn() }))

import LinkSection from './linksection'

describe('LinkSection', () => {
  it('rend sans erreur', () => {
    const { container } = render(<LinkSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
