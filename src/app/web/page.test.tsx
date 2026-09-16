import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

// Mock HomePage
vi.mock("./home-page", () => ({
  default: () => <div data-testid="home-page">HomePage</div>,
}));

describe("Home Page (Server/Wrapper)", () => {
  it("renders HomePage component", () => {
    render(<Home />);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
