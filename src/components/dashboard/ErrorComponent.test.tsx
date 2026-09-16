import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorComponent, { Oops } from "./ErrorComponent";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Oops Component", () => {
  it("should render the OopS text", () => {
    const { container } = render(<Oops />);
    expect(container.textContent).toContain("O");
    expect(container.textContent).toContain("p");
    expect(container.textContent).toContain("S");
  });

  it("should render with primary color and bold font", () => {
    const { container } = render(<Oops />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("text-primary");
    expect(wrapper.className).toContain("font-bold");
  });
});

describe("ErrorComponent", () => {
  it("should render 500 error message", () => {
    render(<ErrorComponent error={{ status: 500, originalStatus: 500 }} />);
    expect(screen.getByText("500")).toBeDefined();
    expect(screen.getByText("an_internal_error_occured")).toBeDefined();
  });

  it("should render 400 bad request message", () => {
    render(<ErrorComponent error={{ status: 400, originalStatus: 400 }} />);
    expect(screen.getByText("bad_request")).toBeDefined();
  });

  it("should render 401 unauthorized message", () => {
    render(<ErrorComponent error={{ status: 401, originalStatus: 401 }} />);
    expect(screen.getByText("unauthorized")).toBeDefined();
  });

  it("should render 403 forbidden message", () => {
    render(<ErrorComponent error={{ status: 403, originalStatus: 403 }} />);
    expect(screen.getByText("unauthorized")).toBeDefined();
  });

  it("should render 404 not found message", () => {
    render(<ErrorComponent error={{ status: 404, originalStatus: 404 }} />);
    expect(screen.getByText("not_found_ressource")).toBeDefined();
  });

  it("should use originalStatus fallback for 500 errors", () => {
    render(<ErrorComponent error={{ status: 0, originalStatus: 502 }} />);
    expect(screen.getByText("500")).toBeDefined();
  });
});
