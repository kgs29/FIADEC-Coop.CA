import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  usePathname: vi.fn(() => "/admin/administration/users"),
}))

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetUsersQuery: vi.fn(() => ({ data: { count: 0, results: [] }, isFetching: false })),
}))

vi.mock("@/components/BulkActionBar", () => ({ BulkActionBar: () => null }))
vi.mock("@/components/ImportModal", () => ({ ImportModal: () => null }))
vi.mock("@/components/SortableHeader", () => ({ SortableHeader: () => null }))
vi.mock("@/lib/exportTable", () => ({ exportToCsv: vi.fn(), exportToExcel: vi.fn() }))
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock("@/components/ui/pagination", () => ({ Pagination: ({ children }: any) => <div>{children}</div>, PaginationContent: ({ children }: any) => <div>{children}</div>, PaginationEllipsis: () => <span/>, PaginationItem: ({ children }: any) => <div>{children}</div>, PaginationLink: ({ children }: any) => <a>{children}</a>, PaginationNext: () => null, PaginationPrevious: () => null }))
vi.mock("@/components/ui/select", () => ({ Select: ({ children }: any) => <div>{children}</div>, SelectContent: ({ children }: any) => <div>{children}</div>, SelectGroup: ({ children }: any) => <div>{children}</div>, SelectItem: ({ children }: any) => <div>{children}</div>, SelectTrigger: ({ children }: any) => <div>{children}</div>, SelectValue: () => null }))

import DataSection from "./datasection"

describe("DataSection", () => {
  it("rend GenericFilter et RealServerDataTable", () => {
    const { container } = render(<DataSection />)
    expect(container.firstChild).toBeTruthy()
  })
})
