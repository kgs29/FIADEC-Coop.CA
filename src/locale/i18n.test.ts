import { describe, it, expect, vi } from 'vitest'

vi.mock('i18next', () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockResolvedValue(undefined),
    language: 'fr',
  },
}))
vi.mock('react-i18next', () => ({ initReactI18next: {} }))
vi.mock('i18next-browser-languagedetector', () => ({ default: {} }))

describe('i18n module', () => {
  it('peut être importé sans erreur', async () => {
    const mod = await import('./i18n')
    expect(mod).toBeDefined()
  })
})
