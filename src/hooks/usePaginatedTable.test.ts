import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePaginatedTable } from './usePaginatedTable'

describe('usePaginatedTable', () => {
  it('initialise page à 1 et pageSize à 10', () => {
    const { result } = renderHook(() => usePaginatedTable())
    expect(result.current.page).toBe(1)
    expect(result.current.pageSize).toBe(10)
  })

  it('setPage met à jour la page', () => {
    const { result } = renderHook(() => usePaginatedTable())
    act(() => result.current.setPage(3))
    expect(result.current.page).toBe(3)
  })

  it('setPageSize met à jour la taille de page', () => {
    const { result } = renderHook(() => usePaginatedTable())
    act(() => result.current.setPageSize(25))
    expect(result.current.pageSize).toBe(25)
  })

  it('remet la page à 1 quand externalSearch change', () => {
    let search = 'a'
    const { result, rerender } = renderHook(() => usePaginatedTable(search))
    act(() => result.current.setPage(5))
    expect(result.current.page).toBe(5)

    search = 'b'
    rerender()
    expect(result.current.page).toBe(1)
  })

  describe('getPaginationRange', () => {
    it('retourne [1] pour totalPages = 1', () => {
      const { result } = renderHook(() => usePaginatedTable())
      expect(result.current.getPaginationRange(1)).toEqual([1])
    })

    it('retourne les pages avec ellipsis quand la page courante est éloignée de la fin', () => {
      const { result } = renderHook(() => usePaginatedTable())
      const range = result.current.getPaginationRange(5)
      expect(range[0]).toBe(1)
      expect(range[range.length - 1]).toBe(5)
    })

    it('insère ellipsis pour de nombreuses pages', () => {
      const { result } = renderHook(() => usePaginatedTable())
      const range = result.current.getPaginationRange(20)
      expect(range).toContain('ellipsis')
      expect(range[0]).toBe(1)
      expect(range[range.length - 1]).toBe(20)
    })

    it('toujours inclure la page courante dans la plage', () => {
      const { result } = renderHook(() => usePaginatedTable())
      act(() => result.current.setPage(10))
      const range = result.current.getPaginationRange(20)
      expect(range).toContain(10)
    })

    it('ne met pas deux ellipsis consécutifs', () => {
      const { result } = renderHook(() => usePaginatedTable())
      const range = result.current.getPaginationRange(30)
      for (let i = 0; i < range.length - 1; i++) {
        expect(range[i] === 'ellipsis' && range[i + 1] === 'ellipsis').toBe(false)
      }
    })
  })
})
