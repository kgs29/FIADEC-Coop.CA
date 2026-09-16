import { describe, it, expect } from 'vitest'
import { OrderApi } from './order.api'

describe('OrderApi', () => {
  it('est défini', () => {
    expect(OrderApi).toBeDefined()
  })

  it('a un reducerPath', () => {
    expect(typeof OrderApi.reducerPath).toBe('string')
    expect(OrderApi.reducerPath.length).toBeGreaterThan(0)
  })

  it('a un reducer', () => {
    expect(typeof OrderApi.reducer).toBe('function')
  })

  it('a un middleware', () => {
    expect(typeof OrderApi.middleware).toBe('function')
  })

  it('expose l\'endpoint getOrders', () => {
    expect(OrderApi.endpoints.getMyOrders).toBeDefined()
  })

  it('a util.invalidateTags', () => {
    expect(typeof OrderApi.util.invalidateTags).toBe('function')
  })
})
