import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | false | null)[]) =>
    classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
  CheckIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="check-icon" {...props} />
  ),
  ChevronRightIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="chevron-right-icon" {...props} />
  ),
  CircleIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="circle-icon" {...props} />
  ),
}));

vi.mock("@radix-ui/react-dropdown-menu", () => {
  const Root = ({
    children,
    open,
    onOpenChange,
  }: React.PropsWithChildren<{
    open?: boolean;
    onOpenChange?: (o: boolean) => void;
  }>) => (
    <div data-testid="dropdown-root" data-open={open}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                _onOpenChange?: (o: boolean) => void;
              }>,
              { _onOpenChange: onOpenChange },
            )
          : child,
      )}
    </div>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-portal">{children}</div>
  );

  const Trigger = ({
    children,
    _onOpenChange,
    ...props
  }: React.PropsWithChildren<{ _onOpenChange?: (o: boolean) => void }>) => (
    <button
      data-testid="dropdown-trigger"
      onClick={() => _onOpenChange?.(true)}
      {...props}
    >
      {children}
    </button>
  );

  const Content = ({
    children,
    className,
    sideOffset,
    ...props
  }: React.PropsWithChildren<{ className?: string; sideOffset?: number }>) => (
    <div
      data-testid="dropdown-content"
      className={className}
      data-side-offset={sideOffset}
      {...props}
    >
      {children}
    </div>
  );

  const Group = ({ children, ...props }: React.PropsWithChildren<object>) => (
    <div data-testid="dropdown-group" {...props}>
      {children}
    </div>
  );

  const Label = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dropdown-label" className={className} {...props}>
      {children}
    </div>
  );

  const Item = ({
    children,
    className,
    onSelect,
    disabled,
    ...props
  }: React.PropsWithChildren<{
    className?: string;
    onSelect?: () => void;
    disabled?: boolean;
  }>) => (
    <div
      data-testid="dropdown-item"
      className={className}
      onClick={!disabled ? onSelect : undefined}
      role="menuitem"
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );

  const CheckboxItem = ({
    children,
    className,
    checked,
    onCheckedChange,
    disabled,
    ...props
  }: React.PropsWithChildren<{
    className?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
  }>) => (
    <div
      data-testid="dropdown-checkbox-item"
      className={className}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      role="menuitemcheckbox"
      aria-checked={checked}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );

  const RadioGroup = ({
    children,
    value,
    onValueChange,
    ...props
  }: React.PropsWithChildren<{
    value?: string;
    onValueChange?: (v: string) => void;
  }>) => (
    <div data-testid="dropdown-radio-group" role="group" {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                _groupValue?: string;
                _onValueChange?: (v: string) => void;
              }>,
              { _groupValue: value, _onValueChange: onValueChange },
            )
          : child,
      )}
    </div>
  );

  const RadioItem = ({
    children,
    className,
    value,
    _groupValue,
    _onValueChange,
    ...props
  }: React.PropsWithChildren<{
    className?: string;
    value: string;
    _groupValue?: string;
    _onValueChange?: (v: string) => void;
  }>) => (
    <div
      data-testid="dropdown-radio-item"
      className={className}
      onClick={() => _onValueChange?.(value)}
      role="menuitemradio"
      aria-checked={_groupValue === value}
      {...props}
    >
      {children}
    </div>
  );

  const Separator = ({ className, ...props }: { className?: string }) => (
    <hr data-testid="dropdown-separator" className={className} {...props} />
  );

  const Sub = ({ children }: React.PropsWithChildren) => (
    <div data-testid="dropdown-sub">{children}</div>
  );

  const SubTrigger = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dropdown-sub-trigger" className={className} {...props}>
      {children}
    </div>
  );

  const SubContent = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dropdown-sub-content" className={className} {...props}>
      {children}
    </div>
  );

  const ItemIndicator = ({ children }: React.PropsWithChildren) => (
    <span data-testid="item-indicator">{children}</span>
  );

  return {
    Root,
    Portal,
    Trigger,
    Content,
    Group,
    Label,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Separator,
    Sub,
    SubTrigger,
    SubContent,
    ItemIndicator,
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DropdownMenu", () => {
  it("renders without crashing", () => {
    render(<DropdownMenu />);
    expect(screen.getByTestId("dropdown-root")).toBeInTheDocument();
  });

  it("forwards open prop", () => {
    render(<DropdownMenu open />);
    expect(screen.getByTestId("dropdown-root")).toHaveAttribute(
      "data-open",
      "true",
    );
  });

  it("calls onOpenChange when trigger is clicked", async () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      </DropdownMenu>,
    );
    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("DropdownMenuPortal", () => {
  it("renders children", () => {
    render(
      <DropdownMenuPortal>
        <span data-testid="portal-child">content</span>
      </DropdownMenuPortal>,
    );
    expect(screen.getByTestId("portal-child")).toBeInTheDocument();
  });
});

describe("DropdownMenuTrigger", () => {
  it("renders children", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
      </DropdownMenu>,
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});

describe("DropdownMenuContent", () => {
  it("renders inside a portal", () => {
    render(<DropdownMenuContent />);
    expect(screen.getByTestId("dropdown-portal")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
  });

  it("uses default sideOffset of 4", () => {
    render(<DropdownMenuContent />);
    expect(screen.getByTestId("dropdown-content")).toHaveAttribute(
      "data-side-offset",
      "4",
    );
  });

  it("forwards className", () => {
    render(<DropdownMenuContent className="custom-class" />);
    expect(screen.getByTestId("dropdown-content")).toHaveClass("custom-class");
  });

  it("renders children", () => {
    render(
      <DropdownMenuContent>
        <span data-testid="content-child">item</span>
      </DropdownMenuContent>,
    );
    expect(screen.getByTestId("content-child")).toBeInTheDocument();
  });
});

describe("DropdownMenuGroup", () => {
  it("renders children", () => {
    render(
      <DropdownMenuGroup>
        <span data-testid="grp-child">grouped</span>
      </DropdownMenuGroup>,
    );
    expect(screen.getByTestId("grp-child")).toBeInTheDocument();
  });
});

describe("DropdownMenuLabel", () => {
  it("renders label text", () => {
    render(<DropdownMenuLabel>My Section</DropdownMenuLabel>);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DropdownMenuLabel className="lbl-class">Lbl</DropdownMenuLabel>);
    expect(screen.getByTestId("dropdown-label")).toHaveClass("lbl-class");
  });

  it("sets data-inset when inset prop is provided", () => {
    render(<DropdownMenuLabel inset>Inset</DropdownMenuLabel>);
    expect(screen.getByTestId("dropdown-label")).toHaveAttribute("data-inset");
  });
});

describe("DropdownMenuItem", () => {
  it("renders children", () => {
    render(<DropdownMenuItem>Open</DropdownMenuItem>);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    render(<DropdownMenuItem onSelect={onSelect}>Click</DropdownMenuItem>);
    await userEvent.click(screen.getByRole("menuitem"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("does not call onSelect when disabled", async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenuItem disabled onSelect={onSelect}>
        Disabled
      </DropdownMenuItem>,
    );
    await userEvent.click(screen.getByRole("menuitem"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("forwards className", () => {
    render(<DropdownMenuItem className="item-class">X</DropdownMenuItem>);
    expect(screen.getByTestId("dropdown-item")).toHaveClass("item-class");
  });

  it("sets data-inset when inset prop is true", () => {
    render(<DropdownMenuItem inset>Inset</DropdownMenuItem>);
    expect(screen.getByTestId("dropdown-item")).toHaveAttribute("data-inset");
  });

  it("sets data-variant=destructive", () => {
    render(<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>);
    expect(screen.getByTestId("dropdown-item")).toHaveAttribute(
      "data-variant",
      "destructive",
    );
  });
});

describe("DropdownMenuCheckboxItem", () => {
  it("renders children", () => {
    render(<DropdownMenuCheckboxItem>Show toolbar</DropdownMenuCheckboxItem>);
    expect(screen.getByText("Show toolbar")).toBeInTheDocument();
  });

  it("renders check icon indicator", () => {
    render(<DropdownMenuCheckboxItem>Option</DropdownMenuCheckboxItem>);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("reflects checked state via aria-checked", () => {
    render(
      <DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>,
    );
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("calls onCheckedChange with toggled value when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenuCheckboxItem
        checked={false}
        onCheckedChange={onCheckedChange}
      >
        Toggle
      </DropdownMenuCheckboxItem>,
    );
    await userEvent.click(screen.getByRole("menuitemcheckbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("forwards className", () => {
    render(
      <DropdownMenuCheckboxItem className="cb-class">
        CB
      </DropdownMenuCheckboxItem>,
    );
    expect(screen.getByTestId("dropdown-checkbox-item")).toHaveClass(
      "cb-class",
    );
  });
});

describe("DropdownMenuRadioGroup + DropdownMenuRadioItem", () => {
  it("renders radio items", () => {
    render(
      <DropdownMenuRadioGroup value="a">
        <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(2);
  });

  it("marks selected item as checked", () => {
    render(
      <DropdownMenuRadioGroup value="b">
        <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    const items = screen.getAllByRole("menuitemradio");
    expect(items[0]).toHaveAttribute("aria-checked", "false");
    expect(items[1]).toHaveAttribute("aria-checked", "true");
  });

  it("calls onValueChange when a radio item is clicked", async () => {
    const onValueChange = vi.fn();
    render(
      <DropdownMenuRadioGroup value="a" onValueChange={onValueChange}>
        <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    await userEvent.click(screen.getAllByRole("menuitemradio")[1]);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders radio item children correctly", () => {
    render(
      <DropdownMenuRadioGroup value="x">
        <DropdownMenuRadioItem value="x">X</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    // CircleIcon indicator was removed from DropdownMenuRadioItem, verify children render
    expect(screen.getByText("X")).toBeInTheDocument();
  });
});

describe("DropdownMenuSeparator", () => {
  it("renders a separator", () => {
    render(<DropdownMenuSeparator />);
    expect(screen.getByTestId("dropdown-separator")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DropdownMenuSeparator className="sep-class" />);
    expect(screen.getByTestId("dropdown-separator")).toHaveClass("sep-class");
  });
});

describe("DropdownMenuShortcut", () => {
  it("renders shortcut text", () => {
    render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(
      <DropdownMenuShortcut className="sc-class">⌘K</DropdownMenuShortcut>,
    );
    expect(screen.getByText("⌘K")).toHaveClass("sc-class");
  });
});

describe("DropdownMenuSub + SubTrigger + SubContent", () => {
  it("renders sub menu structure", () => {
    render(
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Sub item</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>,
    );
    expect(screen.getByTestId("dropdown-sub")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-sub-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-sub-content")).toBeInTheDocument();
  });

  it("renders chevron icon in SubTrigger", () => {
    render(<DropdownMenuSubTrigger>Sub</DropdownMenuSubTrigger>);
    expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();
  });

  it("SubTrigger forwards className", () => {
    render(
      <DropdownMenuSubTrigger className="sub-class">
        Sub
      </DropdownMenuSubTrigger>,
    );
    expect(screen.getByTestId("dropdown-sub-trigger")).toHaveClass("sub-class");
  });

  it("SubTrigger sets data-inset", () => {
    render(<DropdownMenuSubTrigger inset>Sub</DropdownMenuSubTrigger>);
    expect(screen.getByTestId("dropdown-sub-trigger")).toHaveAttribute(
      "data-inset",
    );
  });

  it("SubContent forwards className", () => {
    render(<DropdownMenuSubContent className="sub-content-class" />);
    expect(screen.getByTestId("dropdown-sub-content")).toHaveClass(
      "sub-content-class",
    );
  });
});

describe("DropdownMenu full composition", () => {
  it("renders a complete dropdown menu", async () => {
    const onOpenChange = vi.fn();
    const onNew = vi.fn();
    const onDelete = vi.fn();

    render(
      <DropdownMenu open onOpenChange={onOpenChange}>
        <DropdownMenuTrigger>Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={onNew}>
              New
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Show sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="compact">
            <DropdownMenuRadioItem value="compact">
              Compact
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">
              Comfortable
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByText("Options")).toBeInTheDocument();
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("⌘N")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-separator")).toBeInTheDocument();
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(2);
    expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();

    await userEvent.click(screen.getByText("New"));
    expect(onNew).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByTestId("dropdown-trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
