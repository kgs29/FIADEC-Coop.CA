import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Footer from "./Footer";

// Mock dependencies
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/web"),
}));

vi.mock("next/image", () => ({
  default: ({ priority, fill, ...props }: any) => {
    return <img {...props} />;
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Footer Component", () => {
  it("renders correctly", () => {
    const { container } = render(<Footer />);
    expect(container).toBeDefined();
  });

  it("displays translated text correctly", () => {
    render(<Footer />);
    expect(screen.getByText("footerText")).toBeDefined();
    expect(screen.getByText("custum.footer.useful_links_title")).toBeDefined();
  });

  it("checks if navigation links exist", () => {
    render(<Footer />);
    expect(screen.getByText("custum.header.nav.home")).toBeDefined();
    expect(screen.getByText("custum.header.nav.services")).toBeDefined();
  });

  it("renders social icons and attributes", () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks.length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Facebook")).toBeDefined();
    expect(screen.getByLabelText(/twitter/i)).toBeDefined();
    expect(screen.getByLabelText("LinkedIn")).toBeDefined();
  });

  it("displays current year copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    // Use substring match as the label might include objects when translation mock doesn't interpolate
    expect(screen.getByText(/custum.footer.copyright/)).toBeDefined();
  });
});
