import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetStatsConfigQuery: () => ({ data: undefined, isLoading: false }),
  useUpdateStatsConfigMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock("@/hooks/useStatsConfig", () => ({ DEFAULT_CHART_COLORS: [], DEFAULT_DARK_CHART_COLORS: [] }))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import { StatsChartsTab } from "./StatsChartsTab"

describe("StatsChartsTab", () => {
  it("rend sans erreur", () => {
    const { container } = render(<StatsChartsTab />)
    expect(container.firstChild).toBeTruthy()
  })
})
