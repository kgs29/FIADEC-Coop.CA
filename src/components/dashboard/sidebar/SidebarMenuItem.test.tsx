import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "lucide-react";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

import { SidebarMenuItem } from "./SidebarMenuItem";

describe("SidebarMenuItem Component", () => {
  it("should render label text", () => {
    render(<SidebarMenuItem icon={Home} label="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeDefined();
  });

  it("should render as a link when href is provided", () => {
    const { container } = render(<SidebarMenuItem icon={Home} label="Home" href="/home" />);
    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("/home");
  });

  it("should render as a button when isButton is true", () => {
    render(<SidebarMenuItem icon={Home} label="Action" isButton />);
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("should render chevron when hasChevron is true", () => {
    const { container } = render(<SidebarMenuItem icon={Home} label="Expand" hasChevron isButton />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(1);
  });

  it("should apply active styles when isActive is true", () => {
    const { container } = render(<SidebarMenuItem icon={Home} label="Active" href="/active" isActive />);
    const link = container.querySelector("a");
    expect(link?.className).toContain("bg-primary/10");
    expect(link?.className).toContain("text-primary");
  });

  it("should apply custom className", () => {
    const { container } = render(<SidebarMenuItem icon={Home} label="Custom" className="my-custom" />);
    const div = container.querySelector(".my-custom");
    expect(div).toBeTruthy();
  });

  it("should render icon SVG", () => {
    const { container } = render(<SidebarMenuItem icon={Home} label="WithIcon" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
