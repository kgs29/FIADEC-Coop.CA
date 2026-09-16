import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/dashboard",
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: (selector: any) => selector({
    auth: {
      user: { username: "admin", email: "admin@test.com", is_editor: false, groups: [] },
    },
    config: { config: null },
  }),
}));

vi.mock("@/hooks/use-permissions", () => ({
  default: () => ({ hasPermission: () => true }),
}));

vi.mock("@/assets/images", () => ({
  IMAGES: { logo: "/logo.png" },
}));

import { Sidebar } from "./Sidebar";

describe("Sidebar Component", () => {
  it("should render desktop sidebar", () => {
    const { container } = render(<Sidebar />);
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("should display user username in uppercase", () => {
    render(<Sidebar />);
    expect(screen.getByText("ADMIN")).toBeDefined();
  });

  it("should display the admin role text", () => {
    render(<Sidebar />);
    expect(screen.getByText("User.role.admin")).toBeDefined();
  });

  it("should render app name badge", () => {
    render(<Sidebar />);
    // SidebarLogo renders appName (defaults to "Administration" when no config)
    expect(screen.getByText("Administration")).toBeDefined();
  });

  it("should have sticky sidebar for desktop", () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("sticky");
  });
});
