import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import usePermission from './use-permissions'
import type { PermissionInterface } from '@/types/permission.type'

const makePermission = (codename: string): PermissionInterface => ({
  id: 1,
  name: codename,
  codename: codename as PermissionInterface['codename'],
  content_type: 1,
})

describe('usePermission', () => {
  it('retourne true si la permission existe', () => {
    const permissions = [makePermission('add_user'), makePermission('change_user')]
    const { result } = renderHook(() => usePermission(permissions))
    expect(result.current.hasPermission('add_user')).toBe(true)
  })

  it('retourne false si la permission est absente', () => {
    const permissions = [makePermission('add_user')]
    const { result } = renderHook(() => usePermission(permissions))
    expect(result.current.hasPermission('delete_user' as PermissionInterface['codename'])).toBe(false)
  })

  it('retourne false avec un tableau vide', () => {
    const { result } = renderHook(() => usePermission([]))
    expect(result.current.hasPermission('add_user')).toBe(false)
  })

  it('gère les doublons sans erreur', () => {
    const permissions = [makePermission('add_user'), makePermission('add_user')]
    const { result } = renderHook(() => usePermission(permissions))
    expect(result.current.hasPermission('add_user')).toBe(true)
  })

  it('expose la fonction hasPermission', () => {
    const { result } = renderHook(() => usePermission([]))
    expect(typeof result.current.hasPermission).toBe('function')
  })
})
