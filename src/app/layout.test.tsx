import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// ── Next.js font mock ─────────────────────────────────────────────────────────
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "geist-sans" }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
    className: "geist-mono",
  }),
}));

// ── CSS imports ───────────────────────────────────────────────────────────────
vi.mock("./globals.css", () => ({}));
vi.mock("leaflet/dist/leaflet.css", () => ({}));
vi.mock("react-big-calendar/lib/css/react-big-calendar.css", () => ({}));

// ── Providers mock ────────────────────────────────────────────────────────────
vi.mock("./providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

// ── Toaster mock ──────────────────────────────────────────────────────────────
vi.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

import RootLayout, { metadata } from "./layout.tsx";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("RootLayout", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <RootLayout>
        <span data-testid="page">Page Content</span>
      </RootLayout>,
    );
    expect(container).toBeTruthy();
  });

  it("wraps children inside the Providers component", () => {
    render(
      <RootLayout>
        <span data-testid="page">Page</span>
      </RootLayout>,
    );
    expect(screen.getByTestId("providers")).toBeTruthy();
    expect(screen.getByTestId("page")).toBeTruthy();
  });

  it("renders the Toaster component", () => {
    render(
      <RootLayout>
        <span>Page</span>
      </RootLayout>,
    );
    expect(screen.getByTestId("toaster")).toBeTruthy();
  });

  it("renders children through Providers", () => {
    render(
      <RootLayout>
        <span data-testid="child">Hello</span>
      </RootLayout>,
    );
    expect(screen.getByTestId("child").textContent).toBe("Hello");
  });
});

describe("metadata", () => {
  it('exports metadata with a title', () => {
    expect(typeof metadata.title).toBe("string");
    expect(String(metadata.title).length).toBeGreaterThan(0);
  });

  it("exports metadata with a description", () => {
    expect(typeof metadata.description).toBe("string");
  });
});
