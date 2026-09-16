import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { Sidebar } from "./Sidebar";

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }),
  });
});

const mockPathname = vi.fn(() => "/admin");
let mockIsMobile = false;

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { username: "testuser" } } }),
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => mockIsMobile,
}));

vi.mock("@/components/dashboard/sidebar/SidebarLogo", () => ({
  SidebarLogo: () => <div data-testid="sidebar-logo">Logo</div>,
}));

vi.mock("@/components/dashboard/sidebar/SidebarMenu", () => ({
  SidebarMenu: ({ menuItems, collapsibleItems }: {
    menuItems: { label: string; href: string; isActive: boolean }[];
    collapsibleItems: { id: string; label: string; isActive: boolean; subItems: { label: string; href: string }[] }[];
    isCollapsed?: boolean;
  }) => (
    <nav data-testid="sidebar-menu">
      {menuItems.map((item) => (
        <a key={item.href} href={item.href} data-testid={`menu-item-${item.href}`} data-active={String(item.isActive)}>
          {item.label}
        </a>
      ))}
      {collapsibleItems.map((item) => (
        <div key={item.id} data-testid={`collapsible-${item.id}`} data-active={String(item.isActive)}>
          <span>{item.label}</span>
          {item.subItems.map((sub) => (
            <a key={sub.href} href={sub.href} data-testid={`sub-item-${sub.href}`}>{sub.label}</a>
          ))}
        </div>
      ))}
    </nav>
  ),
}));

vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area">{children}</div>
  ),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/admin");
    mockIsMobile = false;
  });

  describe("desktop mode", () => {
    it("renders an <aside> element", () => {
      render(<Sidebar />);
      expect(document.querySelector("aside")).toBeTruthy();
    });

    it("applies w-72 class on <aside> when not collapsed", () => {
      render(<Sidebar />);
      expect(document.querySelector("aside")?.className).toMatch(/w-72/);
    });

    it("renders the SidebarLogo", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("sidebar-logo")).toBeTruthy();
    });

    it("renders the ScrollArea wrapping the SidebarMenu", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("scroll-area")).toBeTruthy();
      expect(screen.getByTestId("sidebar-menu")).toBeTruthy();
    });

    it("renders the user profile section with username", () => {
      render(<Sidebar />);
      expect(screen.getByText("TESTUSER")).toBeTruthy();
    });

    it("renders the translated admin role label", () => {
      render(<Sidebar />);
      expect(screen.getByText("User.role.admin")).toBeTruthy();
    });

    it("uppercases the username", () => {
      render(<Sidebar />);
      expect(screen.getByText("TESTUSER")).toBeTruthy();
    });
  });

  describe("collapsed mode (isMobile=true)", () => {
    beforeEach(() => { mockIsMobile = true; });

    it("applies w-16 class on <aside>", () => {
      render(<Sidebar />);
      expect(document.querySelector("aside")?.className).toMatch(/w-16/);
    });

    it("hides username text when collapsed", () => {
      render(<Sidebar />);
      expect(screen.queryByText("TESTUSER")).toBeNull();
    });
  });

  describe("menuItems", () => {
    it("renders the home menu item with href /admin", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("menu-item-/admin")).toBeTruthy();
    });

    it("marks home as active when pathname is /admin", () => {
      mockPathname.mockReturnValue("/admin");
      render(<Sidebar />);
      expect(screen.getByTestId("menu-item-/admin").getAttribute("data-active")).toBe("true");
    });

    it("marks home as inactive when pathname is not /admin", () => {
      mockPathname.mockReturnValue("/admin/administration/users");
      render(<Sidebar />);
      expect(screen.getByTestId("menu-item-/admin").getAttribute("data-active")).toBe("false");
    });

    it("renders exactly 1 top-level menu item", () => {
      render(<Sidebar />);
      const items = screen.getByTestId("sidebar-menu").querySelectorAll("a[data-testid^='menu-item-']");
      expect(items.length).toBe(1);
    });
  });

  describe("collapsibleItems", () => {
    it("renders 3 collapsible groups", () => {
      render(<Sidebar />);
      const groups = screen.getByTestId("sidebar-menu").querySelectorAll("[data-testid^='collapsible-']");
      expect(groups.length).toBe(3);
    });

    it("marks administration group as active when pathname includes /admin/administration/", () => {
      mockPathname.mockReturnValue("/admin/administration/users");
      render(<Sidebar />);
      expect(screen.getByTestId("collapsible-item-administration").getAttribute("data-active")).toBe("true");
    });

    it("marks administration group as inactive on other paths", () => {
      mockPathname.mockReturnValue("/admin");
      render(<Sidebar />);
      expect(screen.getByTestId("collapsible-item-administration").getAttribute("data-active")).toBe("false");
    });

    it("marks projects group as active when pathname includes /admin/projects", () => {
      mockPathname.mockReturnValue("/admin/projects");
      render(<Sidebar />);
      expect(screen.getByTestId("collapsible-item-projects").getAttribute("data-active")).toBe("true");
    });

    it("marks paiements group as active when pathname includes /admin/paiements", () => {
      mockPathname.mockReturnValue("/admin/paiements");
      render(<Sidebar />);
      expect(screen.getByTestId("collapsible-item-paiements").getAttribute("data-active")).toBe("true");
    });

    it("renders users sub-item", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("sub-item-/admin/administration/users")).toBeTruthy();
    });

    it("renders roles sub-item", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("sub-item-/admin/administration/roles")).toBeTruthy();
    });

    it("renders projects sub-item", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("sub-item-/admin/projects")).toBeTruthy();
    });

    it("renders paiements sub-item", () => {
      render(<Sidebar />);
      expect(screen.getByTestId("sub-item-/admin/paiements")).toBeTruthy();
    });
  });

  describe("i18n translation keys", () => {
    it("uses translation key for administration label", () => {
      render(<Sidebar />);
      expect(screen.getByText("Dashboard.sidebar.administration")).toBeTruthy();
    });

    it("uses translation key for projects label", () => {
      render(<Sidebar />);
      expect(screen.getAllByText("Dashboard.sidebar.projects").length).toBeGreaterThan(0);
    });

    it("uses translation key for home menu item", () => {
      render(<Sidebar />);
      expect(screen.getByText("Dashboard.sidebar.home")).toBeTruthy();
    });
  });

  describe("null-safe pathname handling", () => {
    it("falls back to empty string when usePathname returns null", () => {
      mockPathname.mockReturnValue(null as unknown as string);
      expect(() => render(<Sidebar />)).not.toThrow();
    });

    it("marks home as inactive when pathname is null", () => {
      mockPathname.mockReturnValue(null as unknown as string);
      render(<Sidebar />);
      expect(screen.getByTestId("menu-item-/admin").getAttribute("data-active")).toBe("false");
    });
  });

  it("matches snapshot in desktop mode", () => {
    const { container } = render(<Sidebar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
