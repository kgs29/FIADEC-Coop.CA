import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockDeleteRole = vi.fn(() => ({ unwrap: () => Promise.resolve() }));

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetRolesQuery: vi.fn(() => ({
    data: {
      count: 2,
      results: [
        { id: 1, name: "Admin Role", groups: [{ id: 1, name: "Admins" }], users_count: 3 },
        { id: 2, name: "Editor Role", groups: [], users_count: 0 },
      ],
    },
    isFetching: false,
  })),
  useDeleteRoleMutation: vi.fn(() => [mockDeleteRole, { isLoading: false }]),
  useArchiveRoleMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
}));

vi.mock("@/components/AuditTimeline", () => ({ AuditTimeline: () => null }))
vi.mock("@/locale/i18n", () => ({ default: { t: (k: string) => k, changeLanguage: vi.fn(), use: () => ({ init: vi.fn() }) } }))
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/admin/administration/roles", useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/link", () => ({ default: ({ children, href }: any) => <a href={href}>{children}</a> }));

import DataSection from "./datasection";

describe("Roles DataSection", () => {
  it("renders role rows", () => {
    render(<DataSection />);
    expect(screen.getByText("Admin Role")).toBeDefined();
    expect(screen.getByText("Editor Role")).toBeDefined();
  });

  it("shows groups for a role", () => {
    render(<DataSection />);
    expect(screen.getByText("Admins")).toBeDefined();
  });

  it("shows users_count", () => {
    render(<DataSection />);
    expect(screen.getByText("3")).toBeDefined();
  });

  it("shows no_groups when role has no groups", () => {
    render(<DataSection />);
    expect(screen.getByText("no_groups")).toBeDefined();
  });

  it("renders rows as clickable", () => {
    render(<DataSection />);
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBeGreaterThan(0);
  });
});
