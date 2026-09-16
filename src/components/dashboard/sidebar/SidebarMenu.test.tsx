import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SidebarMenu, defaultMenuItems, defaultCollapsibleItems } from "./SidebarMenu";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/dashboard",
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: () => ({
    groups: [{ permissions: ["view_dashboard", "manage_users"] }],
  }),
}));

vi.mock("@/hooks/use-permissions", () => ({
  default: () => ({ hasPermission: () => true }),
}));

describe("SidebarMenu Component", () => {
  it("should render default title MENUS", () => {
    render(<SidebarMenu menuItems={[]} />);
    expect(screen.getByText("MENUS")).toBeDefined();
  });

  it("should render custom title", () => {
    render(<SidebarMenu menuItems={[]} title="NAVIGATION" />);
    expect(screen.getByText("NAVIGATION")).toBeDefined();
  });

  it("should render nav element", () => {
    const { container } = render(<SidebarMenu menuItems={[]} />);
    expect(container.querySelector("nav")).toBeTruthy();
  });

  it("should render without crashing with empty items", () => {
    const { container } = render(<SidebarMenu menuItems={[]} collapsibleItems={[]} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("SidebarMenu defaults", () => {
  it("should export defaultMenuItems as an array", () => {
    expect(Array.isArray(defaultMenuItems)).toBe(true);
    expect(defaultMenuItems.length).toBeGreaterThan(0);
  });

  it("should export defaultCollapsibleItems as an array", () => {
    expect(Array.isArray(defaultCollapsibleItems)).toBe(true);
    expect(defaultCollapsibleItems.length).toBeGreaterThan(0);
  });

  it("should have dashboard item in defaultMenuItems", () => {
    const dashboard = defaultMenuItems.find((i) => i.id === "dashboard");
    expect(dashboard).toBeDefined();
    expect(dashboard!.href).toBe("/dashboard");
  });
});
