import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustumBreadcrumb from "./CustumBreadcrumb";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock breackcrumbs-config
vi.mock("@/utils/breackcrumbs-config", () => ({
  generateBreadcrumbs: vi.fn((path) => {
    if (path === "/admin") return [{ title: "dashboard", path: "/admin" }];
    return [
      { title: "Home", path: "/web" },
      { title: "Current Page", path: path },
    ];
  }),
}));

describe("CustumBreadcrumb Component", () => {
  it("renders standard breadcrumb correctly for non-admin path", async () => {
    const { usePathname } = await import("next/navigation");
    (usePathname as any).mockReturnValue("/web/some-page");

    render(<CustumBreadcrumb />);

    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Current Page")).toBeDefined();
  });

  it("renders special dashboard breadcrumb for admin path", async () => {
    const { usePathname } = await import("next/navigation");
    (usePathname as any).mockReturnValue("/admin");

    render(<CustumBreadcrumb />);

    expect(screen.getByText("dashboard")).toBeDefined();
    // Non-admin links shouldn't be present
    expect(screen.queryByText("Home")).toBeNull();
  });
});
