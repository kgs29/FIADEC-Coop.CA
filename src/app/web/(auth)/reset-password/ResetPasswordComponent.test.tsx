import { describe, it, expect, vi, beforeEach } from 'vitest'


import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import "@testing-library/jest-dom/vitest";
import ResetPasswordGetTokenComponent from "./ResetPasswordComponent";


vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key) => key),
    i18n: { language: 'en' }
  }))
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  })),
  usePathname: vi.fn(() => '/')
}))




vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key) => key),
    i18n: { language: "en" },
  })),
}));

vi.mock("next/link", () => ({ default: ({ children }: any) => children }));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));

const mockResetPasswordGetToken = vi.fn();
vi.mock("@/store/apis/auth/authentication.api", () => ({
  useResetPasswordGetTokenMutation: () => [mockResetPasswordGetToken, { isLoading: false }],
}));

// --- Mock matchMedia pour react-hot-toast ---
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

describe("ResetPasswordGetTokenComponent", () => {
  beforeEach(() => {
    mockResetPasswordGetToken.mockReset();
  });

  it("renders the form correctly", () => {
    render(
      <>
        <ResetPasswordGetTokenComponent />
        <Toaster />
      </>
    );

    expect(screen.getByLabelText("reset_password.emailLabel")).toBeInTheDocument();
    expect(screen.getByText("send")).toBeInTheDocument();
  });

  it("submits the form with correct email", async () => {
    render(
      <>
        <ResetPasswordGetTokenComponent />
        <Toaster />
      </>
    );

    const input = screen.getByLabelText("reset_password.emailLabel");
    const button = screen.getByText("send");

    await userEvent.type(input, "test@example.com");
    await userEvent.click(button);

    expect(mockResetPasswordGetToken).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("shows error toast when API returns error", async () => {
    mockResetPasswordGetToken.mockResolvedValue({ error: true });

    render(
      <>
        <ResetPasswordGetTokenComponent />
        <Toaster />
      </>
    );

    const input = screen.getByLabelText("reset_password.emailLabel");
    const button = screen.getByText("send");

    await userEvent.type(input, "wrong@example.com");
    await userEvent.click(button);

    expect(
      await screen.findByText("reset_password.invalid_email_or_another_error")
    ).toBeInTheDocument();
  });

  it("shows success toast and resets form when API succeeds", async () => {
    mockResetPasswordGetToken.mockResolvedValue({ data: true });

    render(
      <>
        <ResetPasswordGetTokenComponent />
        <Toaster />
      </>
    );

    const input = screen.getByLabelText("reset_password.emailLabel") as HTMLInputElement;
    const button = screen.getByText("send");

    await userEvent.type(input, "success@example.com");
    await userEvent.click(button);

    expect(await screen.findByText("reset_password.token_successfully")).toBeInTheDocument();
    expect(input.value).toBe(""); // formulaire réinitialisé
  });
});