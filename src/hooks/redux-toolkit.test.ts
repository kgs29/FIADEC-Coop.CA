import { describe, it, expect } from 'vitest'
import { useAppDispatch, useAppSelector } from './redux-toolkit'

describe('redux-toolkit typed hooks', () => {
  it('useAppDispatch est une fonction', () => {
    expect(typeof useAppDispatch).toBe('function')
  })

  it('useAppSelector est une fonction', () => {
    expect(typeof useAppSelector).toBe('function')
  })
})
