import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/constants/env', () => ({ BASE_API_URL: 'http://localhost:8000/v1/' }))
vi.mock('@/hooks/useTableSearch', () => ({
  useTableSearch: () => ({ filtered: [], search: '', setSearch: vi.fn(), setQuery: vi.fn(), query: '' }),
}))
vi.mock('@/hooks/useTableSort', () => ({
  useTableSort: () => ({ sorted: [], sortKey: null, sortDir: 'asc', handleSort: vi.fn() }),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <div />,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  PaginationContent: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  PaginationItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  PaginationLink: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  PaginationEllipsis: () => <span>...</span>,
  PaginationNext: () => <a>next</a>,
  PaginationPrevious: () => <a>prev</a>,
}))

import ContactsContentPage from './contacts-content-page'

describe('ContactsContentPage', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ContactsContentPage onCountUpdate={vi.fn()} />)
    expect(container.firstChild).toBeTruthy()
  })
})
