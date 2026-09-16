import { describe, it, expect, vi } from 'vitest'
import '@/app/globals.css'
import { render, screen } from "@testing-library/react";
import ResetPasswordGetTokenPage from "./ResetPasswordComponent";
import { metadata } from "./page"

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))


// Mock du composant ResetPasswordComponent
vi.mock("./ResetPasswordComponent", () => ({
  default: () => <div data-testid="reset-password-component">ResetPasswordComponent</div>,
}));

describe("ResetPasswordGetTokenPage", () => {
  it("renders ResetPasswordComponent", () => {
    render(<ResetPasswordGetTokenPage />);
    expect(screen.getByTestId("reset-password-component")).toBeInTheDocument();
  });

  it("has correct metadata", () => {
    expect(metadata.title).toBe("Réinitialisation du mot de passe - FIADEC-COOP-CA");
    expect(metadata.description).toBe("Page de modification du mot de passe pour la plateforme FIADEC-COOP-CA");
  });
});