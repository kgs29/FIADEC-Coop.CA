import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

import DataPagination from './data-pagination'

describe('DataPagination', () => {
  it('rend sans erreur', () => {
    const { container } = render(
      <DataPagination handlePagination={vi.fn()} data={{ count: 50 }} />
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('affiche les numéros de pages', () => {
    render(<DataPagination handlePagination={vi.fn()} data={{ count: 50 }} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('appelle handlePagination lors du clic sur une page', () => {
    const handlePagination = vi.fn()
    render(<DataPagination handlePagination={handlePagination} data={{ count: 50 }} />)
    const page2 = screen.getByText('2')
    fireEvent.click(page2)
    expect(handlePagination).toHaveBeenCalledWith(1)
  })

  it('désactive le bouton précédent à la première page', () => {
    const { container } = render(<DataPagination handlePagination={vi.fn()} data={{ count: 50 }} />)
    // first page: the previous link should have pointer-events-none or aria-disabled
    const prev = container.querySelector('[aria-disabled="true"], .pointer-events-none')
    expect(prev).toBeTruthy()
  })
})
