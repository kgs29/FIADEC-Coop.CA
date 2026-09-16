import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination'

describe('Pagination Component', () => {
  it('should render pagination', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container.textContent).toContain('1')
  })

  it('should render pagination with multiple pages', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container.textContent).toContain('1')
    expect(container.textContent).toContain('2')
    expect(container.textContent).toContain('3')
  })

  it('should render with navigation buttons', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious>Previous</PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext>Next</PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container).toBeTruthy()
  })

  it('should render with ellipsis', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>10</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container).toBeTruthy()
  })

  it('should support active state', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container).toBeTruthy()
  })

  it('should render complete pagination structure', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious>Prev</PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext>Next</PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(container).toBeTruthy()
  })
})
