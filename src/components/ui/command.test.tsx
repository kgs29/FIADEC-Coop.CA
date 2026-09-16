import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("cmdk", () => {
  function CommandRoot({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <div data-testid="command" className={className} {...props}>
        {children}
      </div>
    );
  }

  function CommandInput({
    className,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input data-testid="command-input" className={className} {...props} />
    );
  }

  function CommandList({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <div data-testid="command-list" className={className} {...props}>
        {children}
      </div>
    );
  }

  function CommandEmpty({
    children,
    ...props
  }: React.PropsWithChildren<object>) {
    return (
      <div data-testid="command-empty" {...props}>
        {children}
      </div>
    );
  }

  function CommandGroup({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <div data-testid="command-group" className={className} {...props}>
        {children}
      </div>
    );
  }

  function CommandItem({
    children,
    className,
    onSelect,
    ...props
  }: React.PropsWithChildren<{ className?: string; onSelect?: () => void }>) {
    return (
      <div
        data-testid="command-item"
        className={className}
        onClick={onSelect}
        role="option"
        {...props}
      >
        {children}
      </div>
    );
  }

  function CommandSeparator({ className, ...props }: { className?: string }) {
    return (
      <hr data-testid="command-separator" className={className} {...props} />
    );
  }

  CommandRoot.Input = CommandInput;
  CommandRoot.List = CommandList;
  CommandRoot.Empty = CommandEmpty;
  CommandRoot.Group = CommandGroup;
  CommandRoot.Item = CommandItem;
  CommandRoot.Separator = CommandSeparator;

  return { Command: CommandRoot };
});

vi.mock("@/components/ui/dialog", () => ({
  Dialog: function Dialog({
    children,
    open,
  }: React.PropsWithChildren<{ open?: boolean }>) {
    return open ? <div data-testid="dialog">{children}</div> : null;
  },
  DialogContent: function DialogContent({ children }: React.PropsWithChildren) {
    return <div data-testid="dialog-content">{children}</div>;
  },
  DialogHeader: function DialogHeader({ children }: React.PropsWithChildren) {
    return <div data-testid="dialog-header">{children}</div>;
  },
  DialogTitle: function DialogTitle({ children }: React.PropsWithChildren) {
    return <h2 data-testid="dialog-title">{children}</h2>;
  },
  DialogDescription: function DialogDescription({
    children,
  }: React.PropsWithChildren) {
    return <p data-testid="dialog-description">{children}</p>;
  },
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | false | null)[]) =>
    classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
  SearchIcon: function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg data-testid="search-icon" {...props} />;
  },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Command", () => {
  it("renders without crashing", () => {
    render(<Command />);
    expect(screen.getByTestId("command")).toBeInTheDocument();
  });

  it("forwards className to the root element", () => {
    render(<Command className="custom-class" />);
    expect(screen.getByTestId("command")).toHaveClass("custom-class");
  });

  it("renders children", () => {
    render(
      <Command>
        <span data-testid="child">hello</span>
      </Command>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("CommandInput", () => {
  it("renders with a search icon", () => {
    render(<CommandInput />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders the input element", () => {
    render(<CommandInput placeholder="Search…" />);
    expect(screen.getByTestId("command-input")).toBeInTheDocument();
  });

  it("passes placeholder to the input", () => {
    render(<CommandInput placeholder="Type here" />);
    expect(screen.getByTestId("command-input")).toHaveAttribute(
      "placeholder",
      "Type here",
    );
  });

  it("forwards className to the input", () => {
    render(<CommandInput className="extra" />);
    expect(screen.getByTestId("command-input")).toHaveClass("extra");
  });
});

describe("CommandList", () => {
  it("renders children", () => {
    render(
      <CommandList>
        <span data-testid="list-child">item</span>
      </CommandList>,
    );
    expect(screen.getByTestId("list-child")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<CommandList className="list-class" />);
    expect(screen.getByTestId("command-list")).toHaveClass("list-class");
  });
});

describe("CommandEmpty", () => {
  it("renders its children", () => {
    render(<CommandEmpty>No results found.</CommandEmpty>);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});

describe("CommandGroup", () => {
  it("renders children", () => {
    render(
      <CommandGroup>
        <span data-testid="group-child">grouped</span>
      </CommandGroup>,
    );
    expect(screen.getByTestId("group-child")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<CommandGroup className="group-class" />);
    expect(screen.getByTestId("command-group")).toHaveClass("group-class");
  });
});

describe("CommandItem", () => {
  it("renders children", () => {
    render(<CommandItem>My Item</CommandItem>);
    expect(screen.getByText("My Item")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    render(<CommandItem onSelect={onSelect}>Clickable</CommandItem>);
    await userEvent.click(screen.getByRole("option"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("forwards className", () => {
    render(<CommandItem className="item-class" />);
    expect(screen.getByTestId("command-item")).toHaveClass("item-class");
  });
});

describe("CommandShortcut", () => {
  it("renders the shortcut text", () => {
    render(<CommandShortcut>⌘K</CommandShortcut>);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<CommandShortcut className="shortcut-class">⌘K</CommandShortcut>);
    expect(screen.getByText("⌘K")).toHaveClass("shortcut-class");
  });
});

describe("CommandSeparator", () => {
  it("renders a separator element", () => {
    render(<CommandSeparator />);
    expect(screen.getByTestId("command-separator")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<CommandSeparator className="sep-class" />);
    expect(screen.getByTestId("command-separator")).toHaveClass("sep-class");
  });
});

describe("CommandDialog", () => {
  it("renders nothing when closed", () => {
    render(
      <CommandDialog open={false}>
        <span data-testid="dialog-child">content</span>
      </CommandDialog>,
    );
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("renders content when open", () => {
    render(
      <CommandDialog open>
        <span data-testid="dialog-child">content</span>
      </CommandDialog>,
    );
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-child")).toBeInTheDocument();
  });

  it("renders default title and description for screen readers", () => {
    render(<CommandDialog open />);
    expect(screen.getAllByTestId("dialog-title")[0]).toBeInTheDocument();
    expect(screen.getByTestId("dialog-description")).toBeInTheDocument();
  });

  it("accepts custom title and description props", () => {
    render(
      <CommandDialog open title="My Palette" description="Run a command">
        <span />
      </CommandDialog>,
    );
    expect(screen.getAllByText("My Palette").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Run a command").length).toBeGreaterThan(0);
  });
});

describe("Command composition", () => {
  it("renders a full command palette", async () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
            <CommandItem onSelect={onSelect}>
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={onSelect}>Settings</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem onSelect={onSelect}>Logout</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );

    expect(screen.getByTestId("command")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search commands…")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByText("⌘P")).toBeInTheDocument();
    expect(screen.getByTestId("command-separator")).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("option")[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
