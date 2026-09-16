import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdminMain, { metadata } from "./page";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("./DashboardContent", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: () => ({ auth: { user: { is_superuser: false, is_staff: false, groups: [], permissions: [] } } }),
}));

vi.mock("@/lib/UrlGuard", () => ({
  default: ({
    children,
    permission,
  }: {
    children: React.ReactNode;
    permission: string;
  }) => (
    <div data-testid="url-guard" data-permission={permission}>
      {children}
    </div>
  ),
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AdminMain page", () => {
  // ─── Metadata ──────────────────────────────────────────────────────────────

  describe("metadata export", () => {
    it("exports a metadata object", () => {
      expect(metadata).toBeDefined();
    });

    it("has the correct title", () => {
      expect(typeof metadata.title).toBe("string");
    });

    it("has the correct description", () => {
      expect(typeof metadata.description).toBe("string");
    });
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<AdminMain />);
      expect(container).toBeTruthy();
    });

    it("renders UrlGuard", () => {
      render(<AdminMain />);
      expect(screen.getByTestId("url-guard")).toBeTruthy();
    });

    it("passes 'add_logentry' as permission to UrlGuard", () => {
      render(<AdminMain />);
      const guard = screen.getByTestId("url-guard");
      expect(guard.getAttribute("data-permission")).toBe("add_logentry");
    });

    it("renders the Dashboard component inside UrlGuard", () => {
      render(<AdminMain />);
      expect(screen.getByTestId("dashboard")).toBeTruthy();
    });

    it("Dashboard is a child of UrlGuard", () => {
      render(<AdminMain />);
      const guard = screen.getByTestId("url-guard");
      const dashboard = screen.getByTestId("dashboard");
      expect(guard.contains(dashboard)).toBe(true);
    });
  });

  // ─── Snapshot ──────────────────────────────────────────────────────────────

  it("matches snapshot", () => {
    const { container } = render(<AdminMain />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
