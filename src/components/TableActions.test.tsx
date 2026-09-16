import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TableActions from "./TableActions";

// Mock utilities
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/admin/data"),
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: any) => <span>{i18nKey}</span>,
}));
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock("@/hooks/redux-toolkit", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn().mockReturnValue([]),
}));

// Mock permissions
vi.mock("@/lib/PermissionGuard", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("TableActions Component", () => {
  const mockSingleDeleteProps = {
    isLoading: false,
    handleDelete: vi.fn(),
  };
  const mockActionsClicked = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props: any) =>
    render(<TableActions actionsClicked={mockActionsClicked} singleDelete={mockSingleDeleteProps} {...props} />);

  it("renders trigger correctly", () => {
    renderComponent({ rowSelected: [] });
    // Triggers render via generic dropdown element
    expect(screen.getByText("Actions")).toBeDefined();
  });


  it("does not render single row actions when multiple are selected", () => {
    renderComponent({ rowSelected: ["id-1", "id-2"] });
    const trigger = screen.getByText("Actions");
    fireEvent.click(trigger);

    expect(screen.queryByText("details")).toBeNull();
    expect(screen.queryByText("edit")).toBeNull();
  });


});
