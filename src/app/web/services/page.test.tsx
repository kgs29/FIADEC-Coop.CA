import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('next/link', () => ({ default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

import ServicesPage from './page'

describe('ServicesPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ServicesPage />)
    expect(container.firstChild).toBeTruthy()
  })

  it('n’affiche pas d’image de héros dans la section produits et services', () => {
    const { container } = render(<ServicesPage />)
    const heroImage = container.querySelector('img[alt="web_services.hero_title"]')
    expect(heroImage).toBeNull()
  })
})
