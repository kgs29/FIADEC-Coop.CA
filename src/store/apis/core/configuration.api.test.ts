import { describe, it, expect } from 'vitest'
import { ConfigurationApi } from './configuration.api'

describe('ConfigurationApi', () => {
  it('est défini', () => {
    expect(ConfigurationApi).toBeDefined()
  })

  it('a un reducerPath', () => {
    expect(typeof ConfigurationApi.reducerPath).toBe('string')
    expect(ConfigurationApi.reducerPath.length).toBeGreaterThan(0)
  })

  it('a un reducer', () => {
    expect(typeof ConfigurationApi.reducer).toBe('function')
  })

  it('a un middleware', () => {
    expect(typeof ConfigurationApi.middleware).toBe('function')
  })

  it('expose les hooks d\'endpoint getConfiguration', () => {
    expect(typeof ConfigurationApi.endpoints.getConfiguration).toBe('object')
  })

  it('expose les hooks d\'endpoint updateConfiguration', () => {
    expect(typeof ConfigurationApi.endpoints.updateConfiguration).toBe('object')
  })

  it('a util.updateQueryData', () => {
    expect(typeof ConfigurationApi.util.updateQueryData).toBe('function')
  })
})
