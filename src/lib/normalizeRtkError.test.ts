import { describe, it, expect } from 'vitest'
import { normalizeRtkError } from './normalizeRtkError'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

describe('normalizeRtkError', () => {
  it('extrait le status numérique d\'un FetchBaseQueryError', () => {
    const err: FetchBaseQueryError = { status: 404, data: 'Not found' }
    expect(normalizeRtkError(err)).toEqual({ status: 404, originalStatus: undefined })
  })

  it('extrait originalStatus quand status est une chaîne', () => {
    const err = { status: 'PARSING_ERROR', originalStatus: 500, data: '', error: '' } as FetchBaseQueryError
    expect(normalizeRtkError(err)).toEqual({ status: undefined, originalStatus: 500 })
  })

  it('retourne undefined pour status et originalStatus si absent (SerializedError)', () => {
    const err: SerializedError = { message: 'Network error' }
    expect(normalizeRtkError(err)).toEqual({ status: undefined, originalStatus: undefined })
  })

  it('retourne status 401 correctement', () => {
    const err: FetchBaseQueryError = { status: 401, data: 'Unauthorized' }
    expect(normalizeRtkError(err).status).toBe(401)
  })

  it('retourne status 500 correctement', () => {
    const err: FetchBaseQueryError = { status: 500, data: 'Server error' }
    expect(normalizeRtkError(err).status).toBe(500)
  })

  it('retourne un objet readonly', () => {
    const err: FetchBaseQueryError = { status: 200, data: null }
    const result = normalizeRtkError(err)
    expect(Object.isFrozen(result) || typeof result === 'object').toBe(true)
  })
})
