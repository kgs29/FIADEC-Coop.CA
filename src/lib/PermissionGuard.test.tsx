import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/hooks/redux-toolkit', () => ({
  useAppSelector: vi.fn(),
}))

vi.mock('../hooks/use-permissions', () => ({
  default: vi.fn(),
}))

import { useAppSelector } from '@/hooks/redux-toolkit'
import usePermission from '../hooks/use-permissions'
import PermissionGuard from './PermissionGuard'

const mockUser = (overrides = {}) => ({
  is_superuser: false,
  is_staff: false,
  groups: [],
  ...overrides,
})

describe('PermissionGuard', () => {
  it('affiche les enfants si superuser', () => {
    vi.mocked(useAppSelector).mockReturnValue(mockUser({ is_superuser: true }))
    vi.mocked(usePermission).mockReturnValue({ hasPermission: () => false } as ReturnType<typeof usePermission>)
    render(<PermissionGuard permission="view_user"><span>contenu</span></PermissionGuard>)
    expect(screen.getByText('contenu')).toBeInTheDocument()
  })

  it('affiche les enfants si staff', () => {
    vi.mocked(useAppSelector).mockReturnValue(mockUser({ is_staff: true }))
    vi.mocked(usePermission).mockReturnValue({ hasPermission: () => false } as ReturnType<typeof usePermission>)
    render(<PermissionGuard permission="view_user"><span>staff-ok</span></PermissionGuard>)
    expect(screen.getByText('staff-ok')).toBeInTheDocument()
  })

  it('affiche les enfants si la permission est accordée', () => {
    vi.mocked(useAppSelector).mockReturnValue(mockUser())
    vi.mocked(usePermission).mockReturnValue({ hasPermission: () => true } as ReturnType<typeof usePermission>)
    render(<PermissionGuard permission="view_user"><span>autorisé</span></PermissionGuard>)
    expect(screen.getByText('autorisé')).toBeInTheDocument()
  })

  it('cache les enfants si la permission est refusée', () => {
    vi.mocked(useAppSelector).mockReturnValue(mockUser())
    vi.mocked(usePermission).mockReturnValue({ hasPermission: () => false } as ReturnType<typeof usePermission>)
    render(<PermissionGuard permission="view_user"><span>refusé</span></PermissionGuard>)
    expect(screen.queryByText('refusé')).toBeNull()
  })
})
