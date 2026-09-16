import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('@/store/apis/core/project.api', () => ({
  useGetProjectsQuery: () => ({ data: undefined, isLoading: false, isFetching: false }),
  useDeleteProjectMutation: () => [vi.fn(), { isLoading: false }],
  useArchiveProjectMutation: () => [vi.fn(), { isLoading: false }],
  useDuplicateProjectMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock('next/navigation', () => ({ usePathname: () => '/admin/projects', useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/components/BulkActionBar', () => ({ BulkActionBar: () => null }))
vi.mock('@/components/ImportModal', () => ({ ImportModal: () => null }))
vi.mock('@/lib/exportTable', () => ({ exportToCsv: vi.fn(), exportToExcel: vi.fn() }))
vi.mock('@/lib/bulkApi', () => ({ bulkArchive: vi.fn(), bulkDelete: vi.fn(), importFile: vi.fn() }))
vi.mock('@/components/ui/pagination', () => ({ Pagination: ({ children }: any) => <div>{children}</div>, PaginationContent: ({ children }: any) => <div>{children}</div>, PaginationEllipsis: () => <span/>, PaginationItem: ({ children }: any) => <div>{children}</div>, PaginationLink: ({ children }: any) => <a>{children}</a>, PaginationNext: () => null, PaginationPrevious: () => null }))
vi.mock('@/components/ui/select', () => ({ Select: ({ children }: any) => <div>{children}</div>, SelectContent: ({ children }: any) => <div>{children}</div>, SelectGroup: ({ children }: any) => <div>{children}</div>, SelectItem: ({ children }: any) => <div>{children}</div>, SelectTrigger: ({ children }: any) => <div>{children}</div>, SelectValue: () => null }))

import ProjectDataSection from './ProjectDataSection'

describe('ProjectDataSection', () => {
  it('rend sans erreur', () => {
    const { container } = render(<ProjectDataSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
