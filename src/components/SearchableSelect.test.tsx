import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children, asChild }: any) => asChild ? children : <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}))
vi.mock('@/components/ui/command', () => ({
  Command: ({ children }: any) => <div>{children}</div>,
  CommandEmpty: ({ children }: any) => <div>{children}</div>,
  CommandGroup: ({ children }: any) => <div>{children}</div>,
  CommandInput: ({ onValueChange, ...props }: any) => (
    <input {...props} onChange={(e) => onValueChange?.(e.target.value)} />
  ),
  CommandItem: ({ children, onSelect }: any) => <div onClick={onSelect}>{children}</div>,
  CommandList: ({ children }: any) => <div>{children}</div>,
}))

import { SearchableSelect } from './SearchableSelect'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

describe('SearchableSelect', () => {
  it('rend le bouton déclencheur', () => {
    render(<SearchableSelect options={options} onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('affiche le placeholder par défaut', () => {
    render(<SearchableSelect options={options} onChange={vi.fn()} placeholder="Choisir..." />)
    expect(screen.getByText('Choisir...')).toBeInTheDocument()
  })

  it('affiche la valeur sélectionnée', () => {
    render(<SearchableSelect options={options} value="a" onChange={vi.fn()} />)
    // The combobox button shows the selected label
    expect(screen.getByRole('combobox')).toHaveTextContent('Option A')
  })

  it('affiche les options disponibles', () => {
    render(<SearchableSelect options={options} onChange={vi.fn()} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })
})
