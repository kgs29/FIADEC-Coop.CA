import { describe, it, expect } from 'vitest'
import { ProjectApi } from './project.api'

describe('ProjectApi', () => {
  it('est défini', () => {
    expect(ProjectApi).toBeDefined()
  })

  it('a un reducerPath', () => {
    expect(typeof ProjectApi.reducerPath).toBe('string')
    expect(ProjectApi.reducerPath.length).toBeGreaterThan(0)
  })

  it('a un reducer', () => {
    expect(typeof ProjectApi.reducer).toBe('function')
  })

  it('a un middleware', () => {
    expect(typeof ProjectApi.middleware).toBe('function')
  })

  it('expose l\'endpoint getProjects', () => {
    expect(ProjectApi.endpoints.getProjects).toBeDefined()
  })

  it('expose l\'endpoint getProjectCategories', () => {
    expect(ProjectApi.endpoints.getProjectCategories).toBeDefined()
  })

  it('a util.invalidateTags', () => {
    expect(typeof ProjectApi.util.invalidateTags).toBe('function')
  })
})
