import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/lib/UrlGuard", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock("@/components/StatsTabLayout", () => ({ StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock("./linksection", () => ({ default: () => <div data-testid="link-section">LinkSection</div> }))
vi.mock("./datasection", () => ({ default: () => <div data-testid="data-section">DataSection</div> }))
vi.mock("./UsersStats", () => ({ default: () => null }))
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import UserHome from "./page"

describe("UserHome", () => {
  it("rend LinkSection et DataSection à l'intérieur de UrlGuard", () => {
    render(<UserHome />)
    expect(screen.getByTestId("link-section")).toBeInTheDocument()
    expect(screen.getByTestId("data-section")).toBeInTheDocument()
  })
})
