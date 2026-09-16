import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string, opts?: Record<string, unknown>) => (opts ? `${key}:${JSON.stringify(opts)}` : key) }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

vi.mock("@/constants/env", () => ({
  PHONE: "+237 000",
  LOCATION: "Yaoundé",
  EMAIL_ADDRESS: "test@example.com",
}));

import ChatWidget from "./ChatWidget";

describe("ChatWidget", () => {
  it("is closed by default", () => {
    render(<ChatWidget />);
    expect(screen.queryByText("web_chat.welcome")).toBeNull();
  });

  it("opens the panel and shows the welcome message", () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "web_chat.open" }));
    expect(screen.getByText("web_chat.welcome")).toBeTruthy();
  });

  it("answers a quick-reply topic with a canned response", () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "web_chat.open" }));
    fireEvent.click(screen.getByText("web_chat.topic_services"));
    expect(screen.getAllByText("web_chat.topic_services").length).toBeGreaterThan(0);
    expect(screen.getByText("web_chat.reply_services")).toBeTruthy();
  });

  it("answers free-text input with the fallback response", () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "web_chat.open" }));
    fireEvent.change(screen.getByPlaceholderText("web_chat.input_placeholder"), {
      target: { value: "Bonjour" },
    });
    fireEvent.click(screen.getByRole("button", { name: "web_chat.send" }));
    expect(screen.getByText("Bonjour")).toBeTruthy();
    expect(screen.getByText("web_chat.reply_fallback")).toBeTruthy();
  });

  it("closes the panel from the header close button", () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "web_chat.open" }));
    expect(screen.getByText("web_chat.welcome")).toBeTruthy();
    // Once open, both the panel's header close button and the floating toggle
    // share the "web_chat.close" label - the header one renders first in the DOM.
    const closeButtons = screen.getAllByRole("button", { name: "web_chat.close" });
    fireEvent.click(closeButtons[0]);
    expect(screen.queryByText("web_chat.welcome")).toBeNull();
  });
});
