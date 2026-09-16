import { describe, it, expect } from 'vitest'
import { getDictionary } from './get-dictionary'

describe('getDictionary', () => {
  it('retourne le dictionnaire français pour "fr"', () => {
    const dict = getDictionary('fr')
    expect(dict).toBeDefined()
    expect(typeof dict).toBe('object')
  })

  it('retourne le dictionnaire anglais pour "en"', () => {
    const dict = getDictionary('en')
    expect(dict).toBeDefined()
    expect(typeof dict).toBe('object')
  })

  it('retourne le dictionnaire français pour une locale inconnue (fallback)', () => {
    const dictFr = getDictionary('fr')
    const dictUnknown = getDictionary('xx')
    expect(dictUnknown).toEqual(dictFr)
  })

  it('retourne le dictionnaire français pour une chaîne vide', () => {
    const dictFr = getDictionary('fr')
    const dictEmpty = getDictionary('')
    expect(dictEmpty).toEqual(dictFr)
  })

  it('les dictionnaires fr et en sont différents', () => {
    const fr = getDictionary('fr')
    const en = getDictionary('en')
    expect(fr).not.toEqual(en)
  })

  it('le dictionnaire contient des clés de traduction', () => {
    const dict = getDictionary('fr')
    expect(Object.keys(dict).length).toBeGreaterThan(0)
  })
})
