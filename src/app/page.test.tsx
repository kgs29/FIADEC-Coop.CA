import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => mockRedirect(path),
}));

import Main from "./page.tsx";

describe("Main (page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<Main />);
    expect(container).toBeTruthy();
  });

  it("renders an empty div", () => {
    const { container } = render(<Main />);
    expect(container.firstChild?.nodeName).toBe("DIV");
    expect(container.firstChild?.textContent).toBe("");
  });

  it('calls redirect to "/web" on mount', () => {
    render(<Main />);
    expect(mockRedirect).toHaveBeenCalledWith("/web");
  });

  it("calls redirect exactly once", () => {
    render(<Main />);
    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });

  it("does not redirect to any other path", () => {
    render(<Main />);
    expect(mockRedirect).not.toHaveBeenCalledWith("/");
    expect(mockRedirect).not.toHaveBeenCalledWith("/home");
  });
});
