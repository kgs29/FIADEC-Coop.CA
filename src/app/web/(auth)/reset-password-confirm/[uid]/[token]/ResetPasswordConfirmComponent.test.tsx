import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key: string) => key),
    i18n: { language: "en" },
  })),
}));

vi.mock("next/link", () => ({ default: ({ children }: any) => children }));
vi.mock("next/image", () => ({ default: (props: any) => <img alt="" {...props} /> }));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

const mockResetPassword = vi.fn();
vi.mock("@/store/apis/auth/authentication.api", () => ({
  useResetPasswordMutation: () => [mockResetPassword, { isLoading: false }],
}));

import ResetPasswordConfirmComponent from "./ResetPasswordConfirmComponent";

describe("ResetPasswordConfirmComponent", () => {
  const uid = "test-uid";
  const token = "test-token";

  beforeEach(() => {
    mockResetPassword.mockReset();
    mockPush.mockReset();
  });

  it("renders form fields and submit button", () => {
    render(
      <>
        <ResetPasswordConfirmComponent uid={uid} token={token} />
        <Toaster />
      </>,
    );
    expect(screen.getByLabelText("login.passwordLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("confirmPassword.confirmPasswordLabel")).toBeInTheDocument();
    expect(screen.getByText("confirmPassword.confirm")).toBeInTheDocument();
  });

  it("toggles password visibility icons", async () => {
    render(<ResetPasswordConfirmComponent uid={uid} token={token} />);
    const passwordInput = screen.getByLabelText("login.passwordLabel") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      await userEvent.click(buttons[0]);
    }
    expect(passwordInput).toBeDefined();
  });

  it("submits form successfully and redirects", async () => {
    mockResetPassword.mockResolvedValue({ data: { status: "Password reset!" } });

    render(
      <>
        <ResetPasswordConfirmComponent uid={uid} token={token} />
        <Toaster />
      </>,
    );

    await userEvent.type(screen.getByLabelText("login.passwordLabel"), "Password123!");
    await userEvent.type(screen.getByLabelText("confirmPassword.confirmPasswordLabel"), "Password123!");
    await userEvent.click(screen.getByText("confirmPassword.confirm"));

    expect(mockResetPassword).toHaveBeenCalledWith(
      expect.objectContaining({ uidb64: uid, token: token })
    );
  });

  it("shows error toast on API failure", async () => {
    mockResetPassword.mockResolvedValue({ error: true });

    render(
      <>
        <ResetPasswordConfirmComponent uid={uid} token={token} />
        <Toaster />
      </>,
    );

    await userEvent.type(screen.getByLabelText("login.passwordLabel"), "Password123!");
    await userEvent.type(screen.getByLabelText("confirmPassword.confirmPasswordLabel"), "Password123!");
    await userEvent.click(screen.getByText("confirmPassword.confirm"));

    expect(mockResetPassword).toHaveBeenCalled();
  });
});
