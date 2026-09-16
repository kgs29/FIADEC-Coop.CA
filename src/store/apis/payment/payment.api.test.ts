import { describe, it, expect } from 'vitest'
import { PaymentApi } from './payment.api'

describe('PaymentApi', () => {
  it('est défini', () => {
    expect(PaymentApi).toBeDefined()
  })

  it('a un reducerPath', () => {
    expect(typeof PaymentApi.reducerPath).toBe('string')
    expect(PaymentApi.reducerPath.length).toBeGreaterThan(0)
  })

  it('a un reducer', () => {
    expect(typeof PaymentApi.reducer).toBe('function')
  })

  it('a un middleware', () => {
    expect(typeof PaymentApi.middleware).toBe('function')
  })

  it('expose l\'endpoint getPayments', () => {
    expect(PaymentApi.endpoints.getMyPayments).toBeDefined()
  })

  it('expose l\'endpoint getPaymentMethods', () => {
    expect(PaymentApi.endpoints.getPaymentMethods).toBeDefined()
  })

  it('a util.resetApiState', () => {
    expect(typeof PaymentApi.util.resetApiState).toBe('function')
  })
})
