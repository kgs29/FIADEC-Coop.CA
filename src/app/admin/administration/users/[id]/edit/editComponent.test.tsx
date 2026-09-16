import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EditUserComponent, { Params } from "./EditComponent"; // chemin correct
import UserForm from "../../form";
import ErrorComponent from "@/components/dashboard/ErrorComponent";

// Mock des dépendances
vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetSingleUserQuery: vi.fn(),
}));

vi.mock("../../form", () => ({
  default: vi.fn(({ id }: any) => <div data-testid="user-form">{id}</div>),
}));

vi.mock("@/components/dashboard/ErrorComponent", () => ({
  default: vi.fn(({ error }: any) => <div data-testid="error-component">{error?.message}</div>),
}));

import { useGetSingleUserQuery } from "@/store/apis/auth/authentication.api";

describe("EditUserComponent", () => {
  const mockParams: Params = { id: "123" };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rend UserForm quand user est disponible", () => {
    (useGetSingleUserQuery as any).mockReturnValue({
      data: { id: "123", name: "Test User" },
      error: null,
    });

    render(<EditUserComponent params={mockParams} />);

    expect(screen.getByTestId("user-form")).toHaveTextContent("123");
    expect(screen.queryByTestId("error-component")).toBeNull();
  });

  it("rend ErrorComponent quand error existe", () => {
    (useGetSingleUserQuery as any).mockReturnValue({
      data: null,
      error: { message: "Erreur" },
    });

    render(<EditUserComponent params={mockParams} />);

    expect(screen.getByTestId("error-component")).toBeDefined();
    expect(screen.queryByTestId("user-form")).toBeNull();
  });

  it("ne rend rien si user et error sont null", () => {
    (useGetSingleUserQuery as any).mockReturnValue({
      data: null,
      error: null,
    });

    render(<EditUserComponent params={mockParams} />);

    expect(screen.queryByTestId("user-form")).toBeNull();
    expect(screen.queryByTestId("error-component")).toBeNull();
  });
});