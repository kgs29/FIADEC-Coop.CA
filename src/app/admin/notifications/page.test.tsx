import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/UrlGuard", () => ({
  default: ({ children, permission }: { children: React.ReactNode; permission: string }) => (
    <div data-testid="url-guard" data-permission={permission}>{children}</div>
  ),
}));

vi.mock("@/components/StatsTabLayout", () => ({
  StatsTabLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./notifications-content-page", () => ({
  default: () => <div data-testid="notification-content-page" />,
}));

vi.mock("./NotificationsStats", () => ({ default: () => null }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

import NotificationPage from "./page";

describe("NotificationPage", () => {
  it("renders without crashing", () => {
    render(<NotificationPage />);
    expect(screen.getByTestId("url-guard")).toBeDefined();
  });

  it("wraps content in UrlGuard with correct permission", () => {
    render(<NotificationPage />);
    expect(screen.getByTestId("url-guard").getAttribute("data-permission")).toBe("view_notification");
  });

  it("renders NotificationContentPage inside UrlGuard", () => {
    render(<NotificationPage />);
    expect(screen.getByTestId("notification-content-page")).toBeDefined();
  });

  it("notification content page is a descendant of UrlGuard", () => {
    render(<NotificationPage />);
    const guard = screen.getByTestId("url-guard");
    expect(guard.querySelector("[data-testid='notification-content-page']")).not.toBeNull();
  });
});
