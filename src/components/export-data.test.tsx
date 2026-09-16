import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ExportData } from "./export-data";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ExportData Component", () => {
  const mockOnExport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default state", () => {
    render(<ExportData onExport={mockOnExport} />);

    expect(screen.getByText("export")).toBeDefined();

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("excel");
  });

  it("calls onExport with default format when button is clicked", () => {
    render(<ExportData onExport={mockOnExport} />);

    const button = screen.getByRole("button", { name: /export/i });
    fireEvent.click(button);

    expect(mockOnExport).toHaveBeenCalledWith("excel");
  });

  it("updates format and calls onExport correctly when select is changed", () => {
    render(<ExportData onExport={mockOnExport} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "csv" } });

    const button = screen.getByRole("button", { name: /export/i });
    fireEvent.click(button);

    expect(mockOnExport).toHaveBeenCalledWith("csv");
  });

  it("applies custom class name to container", () => {
    const { container } = render(<ExportData onExport={mockOnExport} className="test-class" />);
    // The main div should have our test-class
    expect(container.firstChild).toHaveProperty("className");
    expect((container.firstChild as HTMLElement).className).toContain("test-class");
  });
});
