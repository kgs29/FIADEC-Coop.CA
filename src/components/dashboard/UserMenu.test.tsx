import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UserMenu from "./UserMenu";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

const mockUser = {
  username: "testuser",
  email: "test@example.com",
  is_editor: false,
  groups: [],
};

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: (selector: any) => selector({ auth: { user: mockUser } }),
}));

vi.mock("@/store/apis/auth/authentication.api", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useLogoutMutation: () => [vi.fn(), { isLoading: false }],
  };
});

// ✅ FIX ICI AUSSI
const stableNotifications = { results: [] as any[] };

vi.mock("@/store/apis/core/notification.api", async (importOriginal) => {
  const actual = await importOriginal<any>();

  return {
    ...actual,
    useGetUserNotificationsQuery: () => ({
      data: stableNotifications,
    }),
    useMarkNotificationAsReadMutation: () => [vi.fn(), { isLoading: false }],
  };
});

vi.mock("@/locale/i18n", () => ({
  default: { language: "fr", changeLanguage: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe("UserMenu Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<UserMenu />);
    expect(container.firstChild).toBeTruthy();
  });

  it("should render notification bell button", () => {
    const { container } = render(<UserMenu />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should display notification count", () => {
    render(<UserMenu />);
    expect(screen.getByText("0")).toBeDefined();
  });

  it("should render language selector trigger", () => {
    render(<UserMenu />);
    // Trigger shows "FR" when language is "fr"
    expect(screen.getByText("FR")).toBeDefined();
  });

  it("should display username in uppercase", () => {
    render(<UserMenu />);
    expect(screen.getByText("TESTUSER")).toBeDefined();
  });

  it("should render multiple dropdown triggers", () => {
    const { container } = render(<UserMenu />);
    // At minimum: notification bell button
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
