// useNavigate.test.ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate } from "./navigate";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useNavigate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne une fonction", () => {
    const { result } = renderHook(() => useNavigate());
    expect(typeof result.current).toBe("function");
  });

  it("appelle router.push avec le chemin fourni", () => {
    const { result } = renderHook(() => useNavigate());
    result.current("/admin/users");
    expect(mockPush).toHaveBeenCalledWith("/admin/users");
  });

  it("n'appelle pas router.push si le chemin est une chaîne vide", () => {
    const { result } = renderHook(() => useNavigate());
    result.current("");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("appelle router.push exactement une fois par appel", () => {
    const { result } = renderHook(() => useNavigate());
    result.current("/admin");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("fonctionne avec plusieurs appels successifs", () => {
    const { result } = renderHook(() => useNavigate());
    result.current("/admin");
    result.current("/admin/news");
    expect(mockPush).toHaveBeenNthCalledWith(1, "/admin");
    expect(mockPush).toHaveBeenNthCalledWith(2, "/admin/news");
    expect(mockPush).toHaveBeenCalledTimes(2);
  });

  it("ignore un appel avec chaîne vide entre deux appels valides", () => {
    const { result } = renderHook(() => useNavigate());
    result.current("/admin");
    result.current("");
    result.current("/admin/users");
    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenNthCalledWith(1, "/admin");
    expect(mockPush).toHaveBeenNthCalledWith(2, "/admin/users");
  });
});