import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomLink from "./CustumLink";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/current-path"),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, passHref, prefetch, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

describe("CustomLink Component", () => {
  it("renders with absolute path correctly", () => {
    render(
      <CustomLink href="https://example.com" absolutePath={true}>
        External Link
      </CustomLink>
    );
    const linkElement = screen.getByText("External Link").closest("a");
    expect(linkElement?.getAttribute("href")).toBe("https://example.com");
  });

  it("renders with relative path correctly appending to current pathname", () => {
    render(
      <CustomLink href="subpage" absolutePath={false}>
        Relative Link
      </CustomLink>
    );
    const linkElement = screen.getByText("Relative Link").closest("a");
    expect(linkElement?.getAttribute("href")).toBe("/current-path/subpage");
  });

  it("applies passed className", () => {
    render(
      <CustomLink href="test" className="custom-class" absolutePath={true}>
        Class Link
      </CustomLink>
    );
    const linkElement = screen.getByText("Class Link").closest("a");
    expect(linkElement?.className).toContain("custom-class");
  });
});
