import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TextCaptcha from "./TextCaptcha";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock window.crypto for secure random
Object.defineProperty(globalThis, "crypto", {
  value: {
    getRandomValues: (arr: Uint32Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
      return arr;
    },
  },
});

describe("TextCaptcha Component", () => {
  const defaultProps = {
    onVerify: vi.fn(),
    handleOpen: vi.fn(),
  };

  it("should render without crashing", () => {
    const { container } = render(<TextCaptcha {...defaultProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("should display the security check title", () => {
    render(<TextCaptcha {...defaultProps} />);
    expect(screen.getByText("security-check")).toBeDefined();
  });

  it("should display verify human text", () => {
    render(<TextCaptcha {...defaultProps} />);
    expect(screen.getByText("verify-human-text")).toBeDefined();
  });

  it("should render a text input for captcha", () => {
    render(<TextCaptcha {...defaultProps} />);
    const input = screen.getByPlaceholderText("enterTextabove");
    expect(input).toBeDefined();
  });

  it("should render the verify button", () => {
    render(<TextCaptcha {...defaultProps} />);
    expect(screen.getByText("verifyNow")).toBeDefined();
  });

  it("should render canvas for captcha display", () => {
    const { container } = render(<TextCaptcha {...defaultProps} />);
    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("should render refresh button", () => {
    const { container } = render(<TextCaptcha {...defaultProps} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3); // refresh + close + submit
  });
});
