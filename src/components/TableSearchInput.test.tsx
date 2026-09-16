import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

import { TableSearchInput } from './TableSearchInput'

describe('TableSearchInput', () => {
  it('rend le champ input', () => {
    render(<TableSearchInput value="" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('affiche la valeur passée en prop', () => {
    render(<TableSearchInput value="test query" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('test query')
  })

  it('appelle onChange quand on tape', () => {
    const onChange = vi.fn()
    render(<TableSearchInput value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'alice' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('affiche un placeholder', () => {
    render(<TableSearchInput value="" onChange={vi.fn()} placeholder="Rechercher..." />)
    expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument()
  })

  it('rend un input de type text', () => {
    render(<TableSearchInput value="" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })
})
