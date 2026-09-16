import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

vi.mock("@/store/apis/core/configuration.api", () => ({
  useGetConfigurationQuery: () => ({ data: undefined, isLoading: false }),
  useGetAppConfigurationQuery: () => ({ data: undefined, isLoading: false }),
  useUpdateConfigurationMutation: () => [vi.fn(), { isLoading: false }],
  useResetConfigurationMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateAppConfigurationMutation: () => [vi.fn(), { isLoading: false }],
  useResetAppConfigurationMutation: () => [vi.fn(), { isLoading: false }],
  useGetStatsConfigQuery: () => ({ data: undefined }),
  useUpdateStatsConfigMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetConfigurationQuery: () => ({ data: undefined, isLoading: false }),
  useGetStatsConfigQuery: () => ({ data: undefined, isLoading: false }),
  useUpdateStatsConfigMutation: () => [vi.fn(), { isLoading: false }],
}))
vi.mock("react-redux", () => ({ useDispatch: () => vi.fn(), useSelector: () => ({}) }))
vi.mock("@/store/slices/configSlice", () => ({ setConfig: vi.fn() }))
vi.mock("@/lib/applyTheme", () => ({ applyThemeConfig: vi.fn() }))
vi.mock("@/hooks/useStatsConfig", () => ({ DEFAULT_CHART_COLORS: [], DEFAULT_DARK_CHART_COLORS: [] }))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }))
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }))
vi.mock("./StatsChartsTab", () => ({ StatsChartsTab: () => null }))

import ConfigurationContent from "./configuration-content"

describe("ConfigurationContent", () => {
  it("rend sans erreur", () => {
    const { container } = render(<ConfigurationContent />)
    expect(container.firstChild).toBeTruthy()
  })
})
