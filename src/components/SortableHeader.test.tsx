import type React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SortableHeader } from './SortableHeader'

// SortableHeader renders a <th>, which is only valid HTML inside a table/thead/tr.
const renderInTable = (ui: React.ReactElement) =>
  render(
    <table>
      <thead>
        <tr>{ui}</tr>
      </thead>
    </table>
  )

describe('SortableHeader', () => {
  it('affiche le label', () => {
    renderInTable(<SortableHeader label="Nom" sortKey="name" currentKey={null} currentDir="asc" onSort={vi.fn()} />)
    expect(screen.getByText('Nom')).toBeInTheDocument()
  })

  it('appelle onSort au clic', () => {
    const onSort = vi.fn()
    renderInTable(<SortableHeader label="Nom" sortKey="name" currentKey={null} currentDir="asc" onSort={onSort} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSort).toHaveBeenCalledWith('name')
  })

  it('affiche l\'icône asc quand actif et asc', () => {
    const { container } = renderInTable(
      <SortableHeader label="Nom" sortKey="name" currentKey="name" currentDir="asc" onSort={vi.fn()} />
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('affiche l\'icône desc quand actif et desc', () => {
    const { container } = renderInTable(
      <SortableHeader label="Nom" sortKey="name" currentKey="name" currentDir="desc" onSort={vi.fn()} />
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('rend correctement quand inactif', () => {
    renderInTable(<SortableHeader label="Age" sortKey="age" currentKey="name" currentDir="asc" onSort={vi.fn()} />)
    expect(screen.getByText('Age')).toBeInTheDocument()
  })
})
