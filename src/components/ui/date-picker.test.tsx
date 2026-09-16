import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuRadioGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuPortal,
} from "./context-menu";

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

vi.mock("@radix-ui/react-context-menu", () => {
  const Root = ({ children }: React.PropsWithChildren) => (
    <div data-testid="context-menu">{children}</div>
  );

  const Trigger = ({ children, ...props }: React.PropsWithChildren<object>) => (
    <div data-testid="context-menu-trigger" {...props}>
      {children}
    </div>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div data-testid="context-menu-portal">{children}</div>
  );

  const Content = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="context-menu-content" className={className} {...props}>
      {children}
    </div>
  );

  const Group = ({ children, ...props }: React.PropsWithChildren<object>) => (
    <div data-testid="context-menu-group" {...props}>
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
    "data-inset"?: boolean;
    "data-variant"?: string;
  }>) => (
    <div
      data-testid="context-menu-item"
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
      data-testid="context-menu-checkbox-item"
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
    <div data-testid="context-menu-radio-group" role="group" {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                _groupValue?: string;
                _onValueChange?: (v: string) => void;
              }>,
              {
                _groupValue: value,
                _onValueChange: onValueChange,
              },
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
      data-testid="context-menu-radio-item"
      className={className}
      onClick={() => _onValueChange?.(value)}
      role="menuitemradio"
      aria-checked={_groupValue === value}
      {...props}
    >
      {children}
    </div>
  );

  const Label = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="context-menu-label" className={className} {...props}>
      {children}
    </div>
  );

  const Separator = ({ className, ...props }: { className?: string }) => (
    <hr data-testid="context-menu-separator" className={className} {...props} />
  );

  const Sub = ({ children }: React.PropsWithChildren) => (
    <div data-testid="context-menu-sub">{children}</div>
  );

  const SubTrigger = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div
      data-testid="context-menu-sub-trigger"
      className={className}
      {...props}
    >
      {children}
    </div>
  );

  const SubContent = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div
      data-testid="context-menu-sub-content"
      className={className}
      {...props}
    >
      {children}
    </div>
  );

  const ItemIndicator = ({ children }: React.PropsWithChildren) => (
    <span data-testid="item-indicator">{children}</span>
  );

  return {
    Root,
    Trigger,
    Portal,
    Content,
    Group,
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Label,
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

describe("ContextMenu", () => {
  it("renders without crashing", () => {
    render(<ContextMenu />);
    expect(screen.getByTestId("context-menu")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <ContextMenu>
        <span data-testid="child">hello</span>
      </ContextMenu>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("ContextMenuTrigger", () => {
  it("renders children", () => {
    render(<ContextMenuTrigger>Right-click me</ContextMenuTrigger>);
    expect(screen.getByText("Right-click me")).toBeInTheDocument();
  });
});

describe("ContextMenuContent", () => {
  it("renders inside a portal", () => {
    render(<ContextMenuContent />);
    expect(screen.getByTestId("context-menu-portal")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu-content")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<ContextMenuContent className="custom" />);
    expect(screen.getByTestId("context-menu-content")).toHaveClass("custom");
  });

  it("renders children", () => {
    render(
      <ContextMenuContent>
        <span data-testid="content-child">item</span>
      </ContextMenuContent>,
    );
    expect(screen.getByTestId("content-child")).toBeInTheDocument();
  });
});

describe("ContextMenuItem", () => {
  it("renders children", () => {
    render(<ContextMenuItem>Open</ContextMenuItem>);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    render(<ContextMenuItem onSelect={onSelect}>Open</ContextMenuItem>);
    await userEvent.click(screen.getByRole("menuitem"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("does not call onSelect when disabled", async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenuItem disabled onSelect={onSelect}>
        Disabled
      </ContextMenuItem>,
    );
    await userEvent.click(screen.getByRole("menuitem"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("forwards className", () => {
    render(<ContextMenuItem className="item-class">X</ContextMenuItem>);
    expect(screen.getByTestId("context-menu-item")).toHaveClass("item-class");
  });

  it("sets data-inset attribute when inset prop is true", () => {
    render(<ContextMenuItem inset>Inset</ContextMenuItem>);
    expect(screen.getByTestId("context-menu-item")).toHaveAttribute(
      "data-inset",
    );
  });

  it("sets data-variant=destructive", () => {
    render(<ContextMenuItem variant="destructive">Delete</ContextMenuItem>);
    expect(screen.getByTestId("context-menu-item")).toHaveAttribute(
      "data-variant",
      "destructive",
    );
  });
});

describe("ContextMenuCheckboxItem", () => {
  it("renders children", () => {
    render(<ContextMenuCheckboxItem>Show toolbar</ContextMenuCheckboxItem>);
    expect(screen.getByText("Show toolbar")).toBeInTheDocument();
  });

  it("renders the check icon indicator", () => {
    render(<ContextMenuCheckboxItem>Option</ContextMenuCheckboxItem>);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("reflects checked state via aria-checked", () => {
    render(<ContextMenuCheckboxItem checked>Checked</ContextMenuCheckboxItem>);
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("calls onCheckedChange when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <ContextMenuCheckboxItem
        checked={false}
        onCheckedChange={onCheckedChange}
      >
        Toggle
      </ContextMenuCheckboxItem>,
    );
    await userEvent.click(screen.getByRole("menuitemcheckbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe("ContextMenuRadioGroup + ContextMenuRadioItem", () => {
  it("renders radio items", () => {
    render(
      <ContextMenuRadioGroup value="a">
        <ContextMenuRadioItem value="a">Option A</ContextMenuRadioItem>
        <ContextMenuRadioItem value="b">Option B</ContextMenuRadioItem>
      </ContextMenuRadioGroup>,
    );
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(2);
  });

  it("marks the selected radio item as checked", () => {
    render(
      <ContextMenuRadioGroup value="b">
        <ContextMenuRadioItem value="a">A</ContextMenuRadioItem>
        <ContextMenuRadioItem value="b">B</ContextMenuRadioItem>
      </ContextMenuRadioGroup>,
    );
    const items = screen.getAllByRole("menuitemradio");
    expect(items[0]).toHaveAttribute("aria-checked", "false");
    expect(items[1]).toHaveAttribute("aria-checked", "true");
  });

  it("calls onValueChange when a radio item is clicked", async () => {
    const onValueChange = vi.fn();
    render(
      <ContextMenuRadioGroup value="a" onValueChange={onValueChange}>
        <ContextMenuRadioItem value="a">A</ContextMenuRadioItem>
        <ContextMenuRadioItem value="b">B</ContextMenuRadioItem>
      </ContextMenuRadioGroup>,
    );
    await userEvent.click(screen.getAllByRole("menuitemradio")[1]);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders the circle icon indicator", () => {
    render(
      <ContextMenuRadioGroup value="x">
        <ContextMenuRadioItem value="x">X</ContextMenuRadioItem>
      </ContextMenuRadioGroup>,
    );
    expect(screen.getByTestId("circle-icon")).toBeInTheDocument();
  });
});

describe("ContextMenuLabel", () => {
  it("renders label text", () => {
    render(<ContextMenuLabel>My Section</ContextMenuLabel>);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<ContextMenuLabel className="lbl-class">Lbl</ContextMenuLabel>);
    expect(screen.getByTestId("context-menu-label")).toHaveClass("lbl-class");
  });

  it("sets data-inset when inset prop provided", () => {
    render(<ContextMenuLabel inset>Inset Label</ContextMenuLabel>);
    expect(screen.getByTestId("context-menu-label")).toHaveAttribute(
      "data-inset",
    );
  });
});

describe("ContextMenuSeparator", () => {
  it("renders a separator", () => {
    render(<ContextMenuSeparator />);
    expect(screen.getByTestId("context-menu-separator")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<ContextMenuSeparator className="sep-class" />);
    expect(screen.getByTestId("context-menu-separator")).toHaveClass(
      "sep-class",
    );
  });
});

describe("ContextMenuShortcut", () => {
  it("renders shortcut text", () => {
    render(<ContextMenuShortcut>⌘C</ContextMenuShortcut>);
    expect(screen.getByText("⌘C")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<ContextMenuShortcut className="sc-class">⌘C</ContextMenuShortcut>);
    expect(screen.getByText("⌘C")).toHaveClass("sc-class");
  });
});

describe("ContextMenuGroup", () => {
  it("renders children", () => {
    render(
      <ContextMenuGroup>
        <span data-testid="grp-child">grouped</span>
      </ContextMenuGroup>,
    );
    expect(screen.getByTestId("grp-child")).toBeInTheDocument();
  });
});

describe("ContextMenuPortal", () => {
  it("renders children", () => {
    render(
      <ContextMenuPortal>
        <span data-testid="portal-child">portal content</span>
      </ContextMenuPortal>,
    );
    expect(screen.getByTestId("portal-child")).toBeInTheDocument();
  });
});

describe("ContextMenuSub + SubTrigger + SubContent", () => {
  it("renders sub menu structure", () => {
    render(
      <ContextMenuSub>
        <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem>Sub item</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>,
    );
    expect(screen.getByTestId("context-menu-sub")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu-sub-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu-sub-content")).toBeInTheDocument();
  });

  it("renders chevron icon inside SubTrigger", () => {
    render(<ContextMenuSubTrigger>Submenu</ContextMenuSubTrigger>);
    expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();
  });

  it("SubTrigger forwards className", () => {
    render(
      <ContextMenuSubTrigger className="sub-class">Sub</ContextMenuSubTrigger>,
    );
    expect(screen.getByTestId("context-menu-sub-trigger")).toHaveClass(
      "sub-class",
    );
  });

  it("SubContent forwards className", () => {
    render(<ContextMenuSubContent className="sub-content-class" />);
    expect(screen.getByTestId("context-menu-sub-content")).toHaveClass(
      "sub-content-class",
    );
  });
});

describe("ContextMenu full composition", () => {
  it("renders a complete context menu", async () => {
    const onOpen = vi.fn();
    const onCopy = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuGroup>
            <ContextMenuItem onSelect={onOpen}>
              Open
              <ContextMenuShortcut>⌘O</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={onCopy}>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>Show Grid</ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="list">
            <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
            <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    );

    expect(screen.getByText("Right-click here")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3); // Open, Copy, Delete
    expect(screen.getByTestId("context-menu-separator")).toBeInTheDocument();
    expect(screen.getByRole("menuitemcheckbox")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(2);
    expect(screen.getByText("⌘O")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Open"));
    expect(onOpen).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByText("Copy"));
    expect(onCopy).toHaveBeenCalledOnce();
  });
});
