import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFound from "./not-found";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className} data-testid="back-link">
      {children}
    </a>
  ),
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("NotFound", () => {
  // ─── Rendering ─────────────────────────────────────────────────────────────

  it("renders without crashing", () => {
    const { container } = render(<NotFound />);
    expect(container).toBeTruthy();
  });

  // ─── Emoji ─────────────────────────────────────────────────────────────────

  it("renders the 😕 emoji", () => {
    render(<NotFound />);
    expect(screen.getByText("😕")).toBeTruthy();
  });

  it("emoji container has text-7xl class", () => {
    render(<NotFound />);
    const emoji = screen.getByText("😕");
    expect(emoji.className).toMatch(/text-7xl/);
  });

  // ─── Title ─────────────────────────────────────────────────────────────────

  it("renders the page title", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("title text is 'Page introuvable'", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Page introuvable",
    );
  });

  it("title has font-semibold and text-2xl classes", () => {
    render(<NotFound />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toMatch(/font-semibold/);
    expect(h1.className).toMatch(/text-2xl/);
  });

  // ─── Description paragraph ─────────────────────────────────────────────────

  it("renders the description paragraph", () => {
    render(<NotFound />);
    const p = screen.getByText(/La page demandée est introuvable/);
    expect(p).toBeTruthy();
  });

  it("description paragraph has text-gray-600 class", () => {
    render(<NotFound />);
    const p = screen.getByText(/La page demandée est introuvable/);
    expect(p.className).toMatch(/text-gray-600/);
  });

  it("description paragraph has text-sm class", () => {
    render(<NotFound />);
    const p = screen.getByText(/La page demandée est introuvable/);
    expect(p.className).toMatch(/text-sm/);
  });

  it("description paragraph has max-w-xl class", () => {
    render(<NotFound />);
    const p = screen.getByText(/La page demandée est introuvable/);
    expect(p.className).toMatch(/max-w-xl/);
  });

  // ─── Back link ─────────────────────────────────────────────────────────────

  it("renders the back-to-dashboard link", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link")).toBeTruthy();
  });

  it("link points to /admin", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").getAttribute("href")).toBe("/admin");
  });

  it("link text contains 'Retour au tableau de bord'", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").textContent?.trim()).toBe(
      "Retour au tableau de bord",
    );
  });

  it("link has bg-green-600 class", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").className).toMatch(/bg-green-600/);
  });

  it("link has hover:bg-green-700 class", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").className).toMatch(
      /hover:bg-green-700/,
    );
  });

  it("link has text-white class", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").className).toMatch(/text-white/);
  });

  it("link has rounded-md class", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").className).toMatch(/rounded-md/);
  });

  it("link has inline-flex class", () => {
    render(<NotFound />);
    expect(screen.getByTestId("back-link").className).toMatch(/inline-flex/);
  });

  // ─── Root wrapper layout ───────────────────────────────────────────────────

  it("root div has min-h-[60vh] class", () => {
    const { container } = render(<NotFound />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/min-h-\[60vh\]/);
  });

  it("root div has flex and flex-col classes", () => {
    const { container } = render(<NotFound />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/flex/);
    expect(root.className).toMatch(/flex-col/);
  });

  it("root div centers content with items-center and justify-center", () => {
    const { container } = render(<NotFound />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/items-center/);
    expect(root.className).toMatch(/justify-center/);
  });

  it("root div has text-center and px-4 classes", () => {
    const { container } = render(<NotFound />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/text-center/);
    expect(root.className).toMatch(/px-4/);
  });

  // ─── Snapshot ──────────────────────────────────────────────────────────────

  it("matches snapshot", () => {
    const { container } = render(<NotFound />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
