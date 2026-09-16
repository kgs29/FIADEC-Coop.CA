// useNavigateBack.test.ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigateBack } from "./navigate-back";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("./breackcrumbs-config", () => ({
  generateBreadcrumbs: vi.fn(),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

import { generateBreadcrumbs } from "./breackcrumbs-config";

const mockGenerateBreadcrumbs = vi.mocked(generateBreadcrumbs);

describe("useNavigateBack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne une fonction", () => {
    const { result } = renderHook(() => useNavigateBack());
    expect(typeof result.current).toBe("function");
  });

  it("navigue vers l'avant-dernier breadcrumb quand links.length > 1", () => {
    mockGenerateBreadcrumbs.mockReturnValue([
      { path: "/admin", title: "Admin" },
      { path: "/admin/users", title: "Users" },
      { path: "/admin/users/1", title: "User 1" },
    ]);

    const { result } = renderHook(() => useNavigateBack());
    result.current();

    expect(mockPush).toHaveBeenCalledWith("/admin/users");
  });

  it("navigue vers '/admin' quand links.length === 1", () => {
    mockGenerateBreadcrumbs.mockReturnValue([
      { path: "/admin", title: "Admin" },
    ]);

    const { result } = renderHook(() => useNavigateBack());
    result.current();

    expect(mockPush).toHaveBeenCalledWith("/admin");
  });

  it("navigue vers '/admin' quand links est vide", () => {
    mockGenerateBreadcrumbs.mockReturnValue([]);

    const { result } = renderHook(() => useNavigateBack());
    result.current();

    expect(mockPush).toHaveBeenCalledWith("/admin");
  });

  it("navigue vers '/admin' quand links.length === 0", () => {
    mockGenerateBreadcrumbs.mockReturnValue([]);

    const { result } = renderHook(() => useNavigateBack());
    result.current();

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/admin");
  });
});
