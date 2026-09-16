import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useCreateADGroupMappingMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateADGroupMappingMutation: () => [vi.fn(), { isLoading: false }],
  useGetRolesQuery: () => ({ data: undefined }),
}))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), back: vi.fn() }), usePathname: () => "/" }))
vi.mock("@/utils/navigate-back", () => ({ useNavigateBack: () => vi.fn() }))
vi.mock("@/components/CancelButton", () => ({ default: ({ onClick }: any) => <button onClick={onClick}>Cancel</button> }))

import ADGroupMappingForm from "./form"

describe("ADGroupMappingForm", () => {
  it("rend sans erreur (mode création)", () => {
    render(<ADGroupMappingForm mode="create" />)
    expect(screen.getByRole("dialog")).toBeTruthy()
  })
})
