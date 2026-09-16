import { describe, it, expect, vi } from 'vitest'
import '@/app/globals.css'

import { render, screen } from "@testing-library/react";

import LoginPage from "./LoginComponent";
import { metadata } from "./page"

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))


// Mock du LoginComponent pour simplifier le test
vi.mock("./LoginComponent", () => ({
  default: () => <div data-testid="login-component">LoginComponent</div>,
}));

describe("LoginPage", () => {
  it("renders LoginComponent", () => {
    render(<LoginPage />);
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  it("has correct metadata", () => {
    expect(metadata.title).toBe("Connexion - FIADEC-COOP-CA");
    expect(metadata.description).toBe("Page d'authentification pour la plateforme FIADEC-COOP-CA");
  });
});