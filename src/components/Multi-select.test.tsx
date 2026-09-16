import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MultiSelect } from "./Multi-select";

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

// Pointer event mocks are required by Radix dropdowns/popovers
window.PointerEvent = class PointerEvent extends Event { } as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

describe("MultiSelect Component", () => {
  const mockOptions = [
    { value: "1", label: "Apple" },
    { value: "2", label: "Banana" },
    { value: "3", label: "Cherry" },
  ];
  const mockOnValueChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with placeholder", () => {
    render(
      <MultiSelect
        options={mockOptions}
        onValueChange={mockOnValueChange}
        placeholder="Select fruits"
      />
    );
    expect(screen.getByText("Select fruits")).toBeDefined();
  });

  it("opens popover on click and lists options", async () => {
    render(
      <MultiSelect
        options={mockOptions}
        onValueChange={mockOnValueChange}
      />
    );

    const trigger = screen.getByLabelText("Multi-select");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeDefined();
      expect(screen.getByText("Banana")).toBeDefined();
      expect(screen.getByText("Cherry")).toBeDefined();
    });
  });

  it("selects an option correctly", async () => {
    render(
      <MultiSelect
        options={mockOptions}
        onValueChange={mockOnValueChange}
      />
    );

    const trigger = screen.getByLabelText("Multi-select");
    fireEvent.click(trigger);

    await waitFor(() => {
      const appleOption = screen.getByText("Apple");
      fireEvent.click(appleOption);
    });

    // Should call with array featuring '1'
    expect(mockOnValueChange).toHaveBeenCalledWith(["1"]);
  });

  it("clears selection when clear button clicked", async () => {
    render(
      <MultiSelect
        options={mockOptions}
        onValueChange={mockOnValueChange}
        defaultValue={["1", "2"]}
      />
    );

    const trigger = screen.getByLabelText("Multi-select");
    fireEvent.click(trigger);

    await waitFor(() => {
      const clearBtn = screen.getByText("clear");
      fireEvent.click(clearBtn);
    });

    expect(mockOnValueChange).toHaveBeenCalledWith([]);
  });

  it("shows loader when isFetching is true", async () => {
    render(
      <MultiSelect
        options={mockOptions}
        onValueChange={mockOnValueChange}
        isFetching={true}
      />
    );

    const trigger = screen.getByLabelText("Multi-select");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("loading")).toBeDefined();
    });
  });
});
