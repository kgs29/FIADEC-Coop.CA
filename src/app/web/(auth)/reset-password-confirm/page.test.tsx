import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ResetPasswordConfirmPage from "./page";
import { useSearchParams } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

// Mock ResetPasswordConfirmComponent
vi.mock("./ResetPasswordConfirmComponent", () => ({
  default: ({ uid, token }: { uid: string; token: string }) => (
    <div data-testid="reset-password-confirm-component">
      UID: {uid}, Token: {token}
    </div>
  ),
}));

describe("ResetPasswordConfirmPage", () => {
  it("extracts uid and token from params and renders component", () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("uid=test-uid&token=test-token") as any);

    render(<ResetPasswordConfirmPage />);

    expect(screen.getByTestId("reset-password-confirm-component")).toBeInTheDocument();
    expect(screen.getByText("UID: test-uid, Token: test-token")).toBeInTheDocument();
  });
});
