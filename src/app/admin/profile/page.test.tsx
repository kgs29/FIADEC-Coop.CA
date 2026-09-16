import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProfilPage from "./page"

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/components/profile-content-page", () => ({
    default: () => <div data-testid="profile-content-page" />,
}))

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("ProfilPage", () => {
    it("renders without crashing", () => {
        render(<ProfilPage />)
        expect(screen.getByTestId("profile-content-page")).toBeDefined()
    })

    it("renders ProfileContentPage", () => {
        render(<ProfilPage />)
        expect(screen.getByTestId("profile-content-page")).toBeDefined()
    })

    it("renders only ProfileContentPage with no extra wrapper", () => {
        const { container } = render(<ProfilPage />)
        expect(container.firstChild).toBe(screen.getByTestId("profile-content-page"))
    })
})