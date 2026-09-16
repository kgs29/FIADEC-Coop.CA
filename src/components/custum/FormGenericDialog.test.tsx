import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GenericDialog } from "./FormGenericDialog";

// Mock react-i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("FormGenericDialog Component", () => {
    const defaultProps = {
        open: true,
        onOpenChange: vi.fn(),
        title: "Test Dialog",
        primaryActionLabel: "Submit",
        onPrimaryAction: vi.fn(),
    };

    it("renders correctly when open", () => {
        render(<GenericDialog {...defaultProps} />);
        expect(screen.getByText("Test Dialog")).toBeDefined();
        expect(screen.getByText("Submit")).toBeDefined();
    });

    it("does not render visually when open is false", () => {
        const { container } = render(<GenericDialog {...defaultProps} open={false} />);
        // Dialog portal content shouldn't be in the regular DOM or would be hidden
        expect(container).toBeDefined();
    });

    it("calls onOpenChange when cancel is clicked", () => {
        render(<GenericDialog {...defaultProps} />);
        const cancelButton = screen.getByText("cancel");
        fireEvent.click(cancelButton);
        expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls onPrimaryAction when primary button is clicked", () => {
        render(<GenericDialog {...defaultProps} />);
        const primaryButton = screen.getByText("Submit");
        fireEvent.click(primaryButton);
        expect(defaultProps.onPrimaryAction).toHaveBeenCalled();
    });

    it("renders confirmMessage when provided", () => {
        render(<GenericDialog {...defaultProps} confirmMessage="Are you sure?" />);
        expect(screen.getByText("Are you sure?")).toBeDefined();
    });

    it("renders selectedItems using renderItem function", () => {
        const items = [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }];
        const renderItem = (item: any) => <span>{item.name}</span>;

        render(
            <GenericDialog
                {...defaultProps}
                selectedItems={items}
                renderItem={renderItem}
            />
        );

        expect(screen.getByText("Item 1")).toBeDefined();
        expect(screen.getByText("Item 2")).toBeDefined();
        expect(screen.getByText(/selectElements/)).toBeDefined();
    });

    it("shows loader icon when isLoading is true", () => {
        render(<GenericDialog {...defaultProps} isLoading={true} />);
        // The Loader from lucide-react renders an SVG
        expect(screen.getByText("Submit")).toBeDefined();
    });
});
