import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/lib/UrlGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/StatsTabLayout', () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('@/app/admin/notifications/notifications-content-page', () => ({ default: () => null }))
vi.mock('@/app/admin/notifications/NotificationsStats', () => ({ default: () => null }))
vi.mock('@/store/apis/core/notification.api', () => ({
  useGetUserNotificationsQuery: () => ({ data: undefined, isLoading: false }),
  useMarkNotificationAsReadMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }))

import NotificationsAdminPage from './page'

describe('NotificationsAdminPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<NotificationsAdminPage />)
    expect(container.firstChild).toBeTruthy()
  })
})
