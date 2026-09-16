import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTableSelection } from './useTableSelection'

const items = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
]

describe('useTableSelection', () => {
  it('initialise sans sélection', () => {
    const { result } = renderHook(() => useTableSelection(items))
    expect(result.current.selectedCount).toBe(0)
    expect(result.current.selectedIds).toHaveLength(0)
  })

  it('toggle sélectionne un élément', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggle(1))
    expect(result.current.isSelected(1)).toBe(true)
    expect(result.current.selectedCount).toBe(1)
  })

  it('toggle désélectionne un élément déjà sélectionné', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggle(1))
    act(() => result.current.toggle(1))
    expect(result.current.isSelected(1)).toBe(false)
    expect(result.current.selectedCount).toBe(0)
  })

  it('toggleAll sélectionne tous les éléments', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggleAll())
    expect(result.current.selectedCount).toBe(3)
    expect(result.current.isAllSelected).toBe(true)
  })

  it('toggleAll désélectionne tout si tout est sélectionné', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggleAll())
    act(() => result.current.toggleAll())
    expect(result.current.selectedCount).toBe(0)
  })

  it('isIndeterminate est true quand une sélection partielle', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggle(1))
    expect(result.current.isIndeterminate).toBe(true)
    expect(result.current.isAllSelected).toBe(false)
  })

  it('clearSelection vide la sélection', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggleAll())
    act(() => result.current.clearSelection())
    expect(result.current.selectedCount).toBe(0)
  })

  it('selectedIds retourne un tableau de strings', () => {
    const { result } = renderHook(() => useTableSelection(items))
    act(() => result.current.toggle(1))
    expect(result.current.selectedIds).toEqual(['1'])
  })

  it('fonctionne avec items vide', () => {
    const { result } = renderHook(() => useTableSelection([]))
    expect(result.current.isAllSelected).toBe(false)
    act(() => result.current.toggleAll())
    expect(result.current.selectedCount).toBe(0)
  })

  it('fonctionne avec des ids de type string', () => {
    const strItems = [{ id: 'abc' }, { id: 'def' }]
    const { result } = renderHook(() => useTableSelection(strItems))
    act(() => result.current.toggle('abc'))
    expect(result.current.isSelected('abc')).toBe(true)
  })
})
