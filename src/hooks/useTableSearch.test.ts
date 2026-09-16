import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTableSearch } from './useTableSearch'

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@test.org' },
]

describe('useTableSearch', () => {
  it('retourne toutes les données quand query est vide', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name', 'email']))
    expect(result.current.filtered).toHaveLength(3)
  })

  it('filtre par nom', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name']))
    act(() => result.current.setQuery('alice'))
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].name).toBe('Alice')
  })

  it('filtre par email', () => {
    const { result } = renderHook(() => useTableSearch(data, ['email']))
    act(() => result.current.setQuery('test.org'))
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].name).toBe('Charlie')
  })

  it('est insensible à la casse', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name']))
    act(() => result.current.setQuery('BOB'))
    expect(result.current.filtered).toHaveLength(1)
  })

  it('filtre sur plusieurs clés', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name', 'email']))
    act(() => result.current.setQuery('example'))
    expect(result.current.filtered).toHaveLength(2)
  })

  it('retourne [] quand aucune correspondance', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name']))
    act(() => result.current.setQuery('xyz'))
    expect(result.current.filtered).toHaveLength(0)
  })

  it('expose query et setQuery', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name']))
    expect(result.current.query).toBe('')
    act(() => result.current.setQuery('test'))
    expect(result.current.query).toBe('test')
  })

  it('retourne données vides si la query ne matche rien', () => {
    const { result } = renderHook(() => useTableSearch(data, ['name']))
    act(() => result.current.setQuery('zzz'))
    expect(result.current.filtered).toHaveLength(0)
  })
})
