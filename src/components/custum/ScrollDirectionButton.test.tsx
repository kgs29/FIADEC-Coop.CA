import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import ScrollDirectionButton from "./ScrollDirectionButton";

function setViewport({ scrollY, innerHeight, scrollHeight }: { scrollY: number; innerHeight: number; scrollHeight: number }) {
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: scrollHeight, configurable: true });
}

describe("ScrollDirectionButton", () => {
  const scrollToMock = vi.fn();

  beforeEach(() => {
    window.scrollTo = scrollToMock;
    scrollToMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing when the page is not scrollable enough", () => {
    setViewport({ scrollY: 0, innerHeight: 800, scrollHeight: 900 });
    const { container } = render(<ScrollDirectionButton />);
    fireEvent.scroll(window);
    expect(container.firstChild).toBeNull();
  });

  it("shows a down arrow near the top and scrolls to the bottom on click", () => {
    setViewport({ scrollY: 0, innerHeight: 800, scrollHeight: 3000 });
    render(<ScrollDirectionButton />);
    fireEvent.scroll(window);
    const button = screen.getByRole("button", { name: "web_scroll_button.to_bottom" });
    fireEvent.click(button);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 3000, behavior: "smooth" });
  });

  it("shows an up arrow past the midpoint and scrolls to the top on click", () => {
    setViewport({ scrollY: 2000, innerHeight: 800, scrollHeight: 3000 });
    render(<ScrollDirectionButton />);
    fireEvent.scroll(window);
    const button = screen.getByRole("button", { name: "web_scroll_button.to_top" });
    fireEvent.click(button);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
