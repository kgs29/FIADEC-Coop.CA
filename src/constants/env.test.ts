import { describe, it, expect } from 'vitest'
import {
  BASE_API_URL,
  EMAIL_ADDRESS,
  PHONE,
  LOCATION,
  FACEBOOK_LINK,
  TWITTER_LINK,
  INSTAGRAM_LINK,
  LINKEDIN_LINK,
} from './env'

describe('env constants', () => {
  it('BASE_API_URL est une chaîne non vide', () => {
    expect(typeof BASE_API_URL).toBe('string')
    expect(BASE_API_URL.length).toBeGreaterThan(0)
  })

  it('EMAIL_ADDRESS contient un @', () => {
    expect(EMAIL_ADDRESS).toContain('@')
  })

  it('PHONE est une chaîne non vide', () => {
    expect(typeof PHONE).toBe('string')
    expect(PHONE.length).toBeGreaterThan(0)
  })

  it('LOCATION est une chaîne non vide', () => {
    expect(typeof LOCATION).toBe('string')
    expect(LOCATION.length).toBeGreaterThan(0)
  })

  it('les liens réseaux sociaux sont des chaînes', () => {
    expect(typeof FACEBOOK_LINK).toBe('string')
    expect(typeof TWITTER_LINK).toBe('string')
    expect(typeof INSTAGRAM_LINK).toBe('string')
    expect(typeof LINKEDIN_LINK).toBe('string')
  })
})
