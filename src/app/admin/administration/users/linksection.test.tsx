// __tests__/LinkSection.test.tsx
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import LinkSection from "./linksection";

// Mock IntersectionObserver
beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  // @ts-ignore
  global.IntersectionObserver = MockIntersectionObserver;
});

afterAll(() => {
  // @ts-ignore
  delete global.IntersectionObserver;
});

// Mock PermissionGuard pour rendre les enfants
vi.mock("@/lib/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock usePathname
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: () => "/admin/users",
  };
});

describe("LinkSection", () => {
  it("rend un bouton avec le texte traduit et un lien correct", () => {
    render(<LinkSection />);

    const button = screen.getByRole("button", { name: "create" });
    expect(button).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "create" });
    expect(link).toHaveAttribute("href", "/admin/users/add");
  });
});