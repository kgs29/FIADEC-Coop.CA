import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTableSort } from './useTableSort'

const data = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 },
]

describe('useTableSort', () => {
  it('retourne les données non triées par défaut', () => {
    const { result } = renderHook(() => useTableSort(data))
    expect(result.current.sorted).toEqual(data)
    expect(result.current.sortKey).toBeNull()
  })

  it('trie par ordre croissant sur handleSort(key)', () => {
    const { result } = renderHook(() => useTableSort(data))
    act(() => result.current.handleSort('name'))
    expect(result.current.sorted[0].name).toBe('Alice')
    expect(result.current.sorted[2].name).toBe('Charlie')
    expect(result.current.sortDir).toBe('asc')
  })

  it('inverse en ordre décroissant si on rappelle handleSort sur la même clé', () => {
    const { result } = renderHook(() => useTableSort(data))
    act(() => result.current.handleSort('name'))
    act(() => result.current.handleSort('name'))
    expect(result.current.sorted[0].name).toBe('Charlie')
    expect(result.current.sortDir).toBe('desc')
  })

  it('change de clé et remet en asc', () => {
    const { result } = renderHook(() => useTableSort(data))
    act(() => result.current.handleSort('name'))
    act(() => result.current.handleSort('age'))
    expect(result.current.sortKey).toBe('age')
    expect(result.current.sortDir).toBe('asc')
    expect(result.current.sorted[0].age).toBe(25)
  })

  it('trie numériquement les nombres', () => {
    const { result } = renderHook(() => useTableSort(data))
    act(() => result.current.handleSort('age'))
    expect(result.current.sorted.map(r => r.age)).toEqual([25, 30, 35])
  })

  it('ne mute pas le tableau original', () => {
    const original = [...data]
    const { result } = renderHook(() => useTableSort(data))
    act(() => result.current.handleSort('name'))
    expect(data).toEqual(original)
  })

  it('trie des données vides sans erreur', () => {
    const { result } = renderHook(() => useTableSort([]))
    act(() => result.current.handleSort('name'))
    expect(result.current.sorted).toEqual([])
  })
})
