import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GenericFilter, convertToDjangoQueryString } from "./SearchFilterComponent";

// Mock React-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Resize observer is required by Radix UI/lucide-react popovers in JSDom
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

window.PointerEvent = class PointerEvent extends Event { } as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

describe("GenericFilter Component", () => {
  const mockOnChange = vi.fn();
  const fieldConfig: any = {
    name: { type: "string", label: "Name Options" },
    age: { type: "number", label: "Age Options" },
    isActive: { type: "boolean", label: "Status" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const generateProps = (filters: any = []) => ({
    model: { name: "", age: 0, isActive: false },
    filters,
    onChange: mockOnChange,
    fieldConfig,
  });

  it("renders correctly with collapsed view initially", () => {
    render(<GenericFilter {...generateProps()} />);
    expect(screen.getByText("advanced_filters")).toBeDefined();
    expect(screen.getByText("no_filters")).toBeDefined();
  });

  it("toggles the advanced filter section on click", () => {
    render(<GenericFilter {...generateProps()} />);

    // Check initial absence of content
    expect(screen.queryByText("add_new_filter")).toBeNull();

    // Click to toggle
    const toggleHeader = screen.getByText("advanced_filters").parentElement?.parentElement;
    fireEvent.click(toggleHeader!);

    // Check expanded view
    expect(screen.getByText("add_new_filter")).toBeDefined();
    expect(screen.getByText("select_field")).toBeDefined();
  });

  it("removes active filter correctly", () => {
    render(<GenericFilter {...generateProps([
      { field: "name", operator: "eq", value: "tester" }
    ])} />);

    // Toggle
    const toggleHeader = screen.getByText("advanced_filters").parentElement?.parentElement;
    fireEvent.click(toggleHeader!);

    // Check badged filter is rendered
    expect(screen.getByText("Name Options")).toBeDefined(); // based on fieldConfig label
    expect(screen.getByText("=")).toBeDefined();
    expect(screen.getByText("tester")).toBeDefined();

    // Remove logic click close button inside the badge. The button is the immediate sibling after value.
    const removeBtn = screen.getByText("tester").nextElementSibling as HTMLElement;
    fireEvent.click(removeBtn);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  // Test functionality for convertToDjangoQueryString logic as exported function
  describe("convertToDjangoQueryString helper", () => {
    it("builds query string for string search perfectly", () => {
      const filters: any = [{ field: "name", operator: "eq", value: "John" }];
      const config: any = { name: { type: "string" } };

      const result = convertToDjangoQueryString(filters, config);
      expect(result).toContain("name__exact=John");
    });

    it("builds correct boolean lookup formats", () => {
      const filters: any = [{ field: "isActive", operator: "eq", value: "true" }];
      const config: any = { isActive: { type: "boolean" } };

      const result = convertToDjangoQueryString(filters, config);
      expect(result).toContain("isActive__exact=true"); // Handled manually by helper map to exact=true value
    });

    it("appends extraParams as well", () => {
      const filters: any = [];
      const config: any = {};
      const extra: any = { page: 2, size: 10 };

      const result = convertToDjangoQueryString(filters, config, extra);
      expect(result).toContain("page=2");
      expect(result).toContain("size=10");
    });
  });
});
