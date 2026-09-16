import { describe, it, expect } from 'vitest'
import { hashPassword } from './hashPassword'

describe('hashPassword', () => {
  it('retourne une chaîne vide pour un mot de passe vide', async () => {
    expect(await hashPassword('')).toBe('')
  })

  it('retourne un hash hexadécimal SHA-256 de 64 caractères', async () => {
    const hash = await hashPassword('password123')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('produit le même hash pour le même input', async () => {
    const h1 = await hashPassword('hello')
    const h2 = await hashPassword('hello')
    expect(h1).toBe(h2)
  })

  it('produit des hash différents pour des inputs différents', async () => {
    const h1 = await hashPassword('hello')
    const h2 = await hashPassword('world')
    expect(h1).not.toBe(h2)
  })

  it('hash de "abc" est de longueur 64 et en hexadécimal', async () => {
    const hash = await hashPassword('abc')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('gère les caractères spéciaux', async () => {
    const hash = await hashPassword('p@$$w0rd!éàü')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })
})
