import { describe, it, expect } from 'vitest'
import * as breadcrumbData from './breakcrumbdatas'

describe('breadcrumb data', () => {
  it('exporte des données', () => {
    const keys = Object.keys(breadcrumbData)
    expect(keys.length).toBeGreaterThan(0)
  })
})
