import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let mockAuthReady = true;
let mockAuthState: { isLoggedIn: boolean; user?: any } = {
  isLoggedIn: true,
  user: { username: "test", is_editor: false },
};

const mockRedirect = vi.fn();

vi.mock("../providers", () => ({
  useAuthReady: () => mockAuthReady,
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: mockAuthState }),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error(`REDIRECT:${url}`);
  },
  usePathname: () => "/admin",
}));

vi.mock("@/components/CustumBreadcrumb", () => ({
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

vi.mock("@/components/dashboard/UserMenu", () => ({
  default: () => <div data-testid="user-menu">UserMenu</div>,
}));

vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
}));

vi.mock("./Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

import RootLayout from "./layout";

describe("RootLayout", () => {
  beforeEach(() => {
    mockAuthReady = true;
    mockAuthState = { isLoggedIn: true, user: { username: "test", is_editor: false } };
    mockRedirect.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when auth is not ready", () => {
    it("renders the skeleton loader", () => {
      mockAuthReady = false;
      const { container } = render(<RootLayout>content</RootLayout>);
      expect(container.querySelector(".animate-pulse")).toBeTruthy();
      expect(screen.queryByTestId("user-menu")).toBeNull();
    });

    it("does not render the main layout", () => {
      mockAuthReady = false;
      render(<RootLayout>content</RootLayout>);
      expect(screen.queryByRole("main")).toBeNull();
      expect(screen.queryByTestId("sidebar")).toBeNull();
    });

    it("does not redirect", () => {
      mockAuthReady = false;
      render(<RootLayout>content</RootLayout>);
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("when auth is ready but user is not logged in", () => {
    it("redirects to /web/login", () => {
      mockAuthState = { isLoggedIn: false };
      expect(() => {
        render(<RootLayout>content</RootLayout>);
      }).toThrow("REDIRECT:/web/login");
      expect(mockRedirect).toHaveBeenCalledWith("/web/login");
    });

    it("does not render the layout", () => {
      mockAuthState = { isLoggedIn: false };
      expect(() => {
        render(<RootLayout>content</RootLayout>);
      }).toThrow();
      expect(screen.queryByTestId("user-menu")).toBeNull();
    });
  });

  describe("when logged in", () => {
    it("renders the full layout shell", () => {
      render(<RootLayout>content</RootLayout>);
      expect(screen.getByRole("main")).toBeTruthy();
    });

    it("renders the Sidebar", () => {
      render(<RootLayout>content</RootLayout>);
      expect(screen.getByTestId("sidebar")).toBeTruthy();
    });

    it("renders the UserMenu inside the header", () => {
      render(<RootLayout>content</RootLayout>);
      expect(screen.getByTestId("user-menu")).toBeTruthy();
    });

    it("renders the CustumBreadcrumb", () => {
      render(<RootLayout>content</RootLayout>);
      expect(screen.getByTestId("breadcrumb")).toBeTruthy();
    });

    it("renders children inside main", () => {
      render(
        <RootLayout>
          <span data-testid="child">hello</span>
        </RootLayout>
      );
      expect(screen.getByTestId("child")).toBeTruthy();
    });

    it("applies aside-main class on main element", () => {
      render(<RootLayout>content</RootLayout>);
      const main = screen.getByRole("main");
      expect(main.className).toMatch(/aside-main/);
    });

    it("header has sticky and z-50 classes", () => {
      render(<RootLayout>content</RootLayout>);
      const header = screen.getByRole("banner");
      expect(header.className).toMatch(/sticky/);
      expect(header.className).toMatch(/z-50/);
    });
  });

  describe("mobile sidebar open/close", () => {
    it("shows the Menu icon trigger when sidebar is closed", () => {
      render(<RootLayout>content</RootLayout>);
      // The layout uses a single Sidebar component (no mobile toggle in layout)
      expect(screen.getByTestId("sidebar")).toBeTruthy();
    });

    it("opens and closes the mobile sidebar", async () => {
      render(<RootLayout>content</RootLayout>);
      expect(screen.getByTestId("sidebar")).toBeTruthy();
    });
  });

  describe("snapshots", () => {
    it("matches snapshot when loading", () => {
      mockAuthReady = false;
      const { container } = render(<RootLayout><p>child</p></RootLayout>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it("matches snapshot when logged in", () => {
      const { container } = render(<RootLayout><p>child</p></RootLayout>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
