import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from './table'

describe('Table Component', () => {
  it('should render table', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.textContent).toContain('Data')
  })

  it('should render table with header', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.textContent).toContain('Name')
    expect(container.textContent).toContain('Email')
  })

  it('should render table with footer', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>100</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total: 100</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
    expect(container.textContent).toContain('Total')
  })

  it('should render multiple rows', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Row 1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 2</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row 3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.textContent).toContain('Row 1')
    expect(container.textContent).toContain('Row 2')
    expect(container.textContent).toContain('Row 3')
  })

  it('should render table with multiple columns', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Product A</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container).toBeTruthy()
  })

  it('should render complete table structure', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Widget</TableCell>
            <TableCell>$9.99</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total: $9.99</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
    expect(container).toBeTruthy()
  })
})
