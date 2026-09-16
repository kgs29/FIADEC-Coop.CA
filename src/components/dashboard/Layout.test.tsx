import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Layout from "./Layout";

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
  useAppSelector: () => ({
    username: "admin",
    email: "admin@test.com",
    is_editor: false,
    groups: [],
  }),
}));

vi.mock("@/store/apis/auth/authentication.api", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useLogoutMutation: () => [vi.fn(), { isLoading: false }],
  };
});

// ✅ FIX ICI
vi.mock("@/store/apis/core/notification.api", async (importOriginal) => {
  const actual = await importOriginal<any>();

  return {
    ...actual,
    useGetUserNotificationsQuery: () => ({ data: undefined }),
    useMarkNotificationAsReadMutation: () => [vi.fn(), { isLoading: false }],
  };
});

vi.mock("@/hooks/use-permissions", () => ({
  default: () => ({ hasPermission: () => true }),
}));

vi.mock("@/locale/i18n", () => ({
  default: { language: "fr", changeLanguage: vi.fn() },
}));

vi.mock("@/assets/images", () => ({
  IMAGES: { logo: "/logo.png" },
}));

describe("Layout Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Layout />);
    expect(container.firstChild).toBeTruthy();
  });

  it("should render the main content area", () => {
    const { container } = render(<Layout />);
    expect(container.querySelector("main")).toBeTruthy();
  });

  it("should render header", () => {
    const { container } = render(<Layout />);
    expect(container.querySelector("header")).toBeTruthy();
  });

  it("should render a mobile menu button", () => {
    const { container } = render(<Layout />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should have flex layout", () => {
    const { container } = render(<Layout />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("flex");
  });
});
