import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock("@/assets/images", () => ({
  IMAGES: { logo: "/logo.png" },
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: () => undefined,
}));

import { SidebarLogo } from "./SidebarLogo";

describe("SidebarLogo Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<SidebarLogo />);
    expect(container.firstChild).toBeTruthy();
  });

  it("should render the logo image", () => {
    const { container } = render(<SidebarLogo />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
  });

  it("should render the app name badge text", () => {
    render(<SidebarLogo />);
    // appName defaults to "Administration" when no config
    expect(screen.getByText("Administration")).toBeDefined();
  });

  it("should have a link to /web", () => {
    const { container } = render(<SidebarLogo />);
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/web");
  });

  it("should have border-b styling", () => {
    const { container } = render(<SidebarLogo />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("border-b");
  });
});
