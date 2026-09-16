import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/font/google", () => ({
  Poppins: () => ({ variable: "--font-poppins", className: "poppins" }),
  Inter: () => ({ variable: "--font-inter", className: "inter" }),
}));

vi.mock("@/components/custum/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("@/components/custum/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
vi.mock("@/components/custum/ScrollDirectionButton", () => ({
  default: () => <div data-testid="scroll-button">ScrollDirectionButton</div>,
}));
vi.mock("@/components/custum/ChatWidget", () => ({
  default: () => <div data-testid="chat-widget">ChatWidget</div>,
}));

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders header, footer, scroll button, chat widget and suggestion page when not on an auth page", () => {
    vi.mocked(usePathname).mockReturnValue("/web/some-page");
    render(<RootLayout>content</RootLayout>);
    expect(screen.getByTestId("header")).toBeTruthy();
    expect(screen.getByTestId("footer")).toBeTruthy();
    expect(screen.getByTestId("scroll-button")).toBeTruthy();
    expect(screen.getByTestId("chat-widget")).toBeTruthy();
    expect(screen.getByText("content")).toBeTruthy();
  });

  it("does not render header, footer, scroll button or chat widget on login page", () => {
    vi.mocked(usePathname).mockReturnValue("/web/login");
    render(<RootLayout>login-content</RootLayout>);
    expect(screen.queryByTestId("header")).toBeNull();
    expect(screen.queryByTestId("footer")).toBeNull();
    expect(screen.queryByTestId("scroll-button")).toBeNull();
    expect(screen.queryByTestId("chat-widget")).toBeNull();
  });

  it("does not render header, footer, scroll button or chat widget on reset-password page", () => {
    vi.mocked(usePathname).mockReturnValue("/web/reset-password");
    render(<RootLayout>reset-content</RootLayout>);
    expect(screen.queryByTestId("header")).toBeNull();
    expect(screen.queryByTestId("footer")).toBeNull();
    expect(screen.queryByTestId("scroll-button")).toBeNull();
    expect(screen.queryByTestId("chat-widget")).toBeNull();
  });

  it("renders children always", () => {
    vi.mocked(usePathname).mockReturnValue("/web/some-page");
    render(<RootLayout><span data-testid="child">hello</span></RootLayout>);
    expect(screen.getByTestId("child")).toBeTruthy();
  });
});
