import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Editor from "./editor-component";

// Mock next/dynamic completely
vi.mock("next/dynamic", () => ({
  default: () => {
    return function MockQuill({ value, onChange, placeholder }: any) {
      return (
        <textarea
          data-testid="mock-quill"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    };
  },
}));

describe("Editor Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the mocked text area when instantiated without crashing on canvas layout", () => {
    const { container } = render(
      <Editor value="Initial Code" placeholder="Type here..." onChange={mockOnChange} />
    );

    expect(container).toBeDefined();
  });

  it("passes placeholder and value props", () => {
    render(
      <Editor value="Initial Text Elements" placeholder="Type here..." onChange={mockOnChange} />
    );

    const textArea = screen.getByTestId("mock-quill") as HTMLTextAreaElement;
    expect(textArea.value).toBe("Initial Text Elements");
    expect(textArea.placeholder).toBe("Type here...");
  });

  it("calls onChange dynamically", () => {
    render(
      <Editor value="Initial Code" placeholder="Type here..." onChange={mockOnChange} />
    );

    const textArea = screen.getByTestId("mock-quill");
    fireEvent.change(textArea, { target: { value: "Updated Text" } });

    expect(mockOnChange).toHaveBeenCalledWith("Updated Text");
  });
});
