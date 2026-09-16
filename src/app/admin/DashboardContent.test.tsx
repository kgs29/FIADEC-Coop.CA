import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/core/project.api', () => ({
  useGetProjectsQuery: () => ({ data: undefined }),
  useGetProjectCategoriesQuery: () => ({ data: undefined }),
}))
vi.mock('@/store/apis/core/notification.api', () => ({
  useGetUserNotificationsQuery: () => ({ data: undefined }),
}))
vi.mock('@/store/apis/payment/payment.api', () => ({
  useGetAllPaymentsQuery: () => ({ data: undefined }),
}))
vi.mock('@/store/apis/auth/authentication.api', () => ({
  useGetADGroupMappingsQuery: () => ({ data: undefined }),
  useGetDevicesQuery: () => ({ data: undefined }),
  useGetRolesQuery: () => ({ data: undefined }),
  useGetRulesQuery: () => ({ data: undefined }),
  useGetUsersQuery: () => ({ data: undefined }),
}))
vi.mock('@/components/dashboard/stats-card', () => ({
  StatCard: ({ title }: { title: string }) => <div>{title}</div>,
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import DashboardContent from './DashboardContent'

describe('DashboardContent', () => {
  it('rend sans erreur', () => {
    const { container } = render(<DashboardContent />)
    expect(container.firstChild).toBeTruthy()
  })
})
