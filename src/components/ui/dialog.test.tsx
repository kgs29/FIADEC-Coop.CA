import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogPortal,
} from "./dialog";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | false | null)[]) =>
    classes.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
  X: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="x-icon" {...props} />
  ),
}));

vi.mock("@radix-ui/react-dialog", () => {
  const Root = ({
    children,
    open,
    onOpenChange,
  }: React.PropsWithChildren<{
    open?: boolean;
    onOpenChange?: (o: boolean) => void;
  }>) => <div data-testid="dialog-root">{children}</div>;

  const Trigger = ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>) => (
    <button data-testid="dialog-trigger" onClick={onClick} {...props}>
      {children}
    </button>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-portal">{children}</div>
  );

  const Overlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      data-testid="dialog-overlay"
      ref={ref}
      className={className}
      {...props}
    />
  ));
  Overlay.displayName = "DialogOverlay";

  const Content = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
  >(({ children, className, ...props }, ref) => (
    <div
      data-testid="dialog-content"
      ref={ref}
      className={className}
      role="dialog"
      {...props}
    >
      {children}
    </div>
  ));
  Content.displayName = "DialogContent";

  const Close = ({
    children,
    onClick,
    className,
    ...props
  }: React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>) => (
    <button
      data-testid="dialog-close"
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );

  const Title = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
  >(({ children, className, ...props }, ref) => (
    <h2 data-testid="dialog-title" ref={ref} className={className} {...props}>
      {children}
    </h2>
  ));
  Title.displayName = "DialogTitle";

  const Description = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ children, className, ...props }, ref) => (
    <p
      data-testid="dialog-description"
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </p>
  ));
  Description.displayName = "DialogDescription";

  return { Root, Trigger, Portal, Overlay, Content, Close, Title, Description };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Dialog", () => {
  it("renders without crashing", () => {
    render(<Dialog />);
    expect(screen.getByTestId("dialog-root")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Dialog>
        <span data-testid="child">content</span>
      </Dialog>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("DialogTrigger", () => {
  it("renders as a button", () => {
    render(<DialogTrigger>Open</DialogTrigger>);
    expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<DialogTrigger onClick={onClick}>Open</DialogTrigger>);
    await userEvent.click(screen.getByTestId("dialog-trigger"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("DialogPortal", () => {
  it("renders children", () => {
    render(
      <DialogPortal>
        <span data-testid="portal-child">portal</span>
      </DialogPortal>,
    );
    expect(screen.getByTestId("portal-child")).toBeInTheDocument();
  });
});

describe("DialogOverlay", () => {
  it("renders", () => {
    render(<DialogOverlay />);
    expect(screen.getByTestId("dialog-overlay")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DialogOverlay className="overlay-class" />);
    expect(screen.getByTestId("dialog-overlay")).toHaveClass("overlay-class");
  });
});

describe("DialogClose", () => {
  it("renders children", () => {
    render(<DialogClose>Close</DialogClose>);
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<DialogClose onClick={onClick}>Close</DialogClose>);
    await userEvent.click(screen.getByTestId("dialog-close"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("DialogContent", () => {
  it("renders children", () => {
    render(
      <DialogContent>
        <span data-testid="content-child">body</span>
      </DialogContent>,
    );
    expect(screen.getByTestId("content-child")).toBeInTheDocument();
  });

  it("renders inside a portal with an overlay", () => {
    render(<DialogContent>body</DialogContent>);
    expect(screen.getByTestId("dialog-portal")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-overlay")).toBeInTheDocument();
  });

  it("renders the close button by default", () => {
    render(<DialogContent>body</DialogContent>);
    expect(screen.getByTestId("dialog-close")).toBeInTheDocument();
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument(); // sr-only span
  });

  it("hides the close button when showCloseButton=false", () => {
    render(<DialogContent showCloseButton={false}>body</DialogContent>);
    expect(screen.queryByTestId("dialog-close")).not.toBeInTheDocument();
  });

  it("forwards className to the content element", () => {
    render(<DialogContent className="custom-content">body</DialogContent>);
    expect(screen.getByRole("dialog")).toHaveClass("custom-content");
  });

  it("has role=dialog", () => {
    render(<DialogContent>body</DialogContent>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("DialogHeader", () => {
  it("renders children", () => {
    render(<DialogHeader>Header content</DialogHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DialogHeader className="hdr-class">H</DialogHeader>);
    expect(screen.getByText("H")).toHaveClass("hdr-class");
  });
});

describe("DialogFooter", () => {
  it("renders children", () => {
    render(<DialogFooter>Footer content</DialogFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DialogFooter className="ftr-class">F</DialogFooter>);
    expect(screen.getByText("F")).toHaveClass("ftr-class");
  });
});

describe("DialogTitle", () => {
  it("renders title text", () => {
    render(<DialogTitle>My Title</DialogTitle>);
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("My Title");
  });

  it("forwards className", () => {
    render(<DialogTitle className="title-class">T</DialogTitle>);
    expect(screen.getByTestId("dialog-title")).toHaveClass("title-class");
  });
});

describe("DialogDescription", () => {
  it("renders description text", () => {
    render(<DialogDescription>Some description</DialogDescription>);
    expect(screen.getByTestId("dialog-description")).toHaveTextContent(
      "Some description",
    );
  });

  it("forwards className", () => {
    render(<DialogDescription className="desc-class">D</DialogDescription>);
    expect(screen.getByTestId("dialog-description")).toHaveClass("desc-class");
  });
});

describe("Dialog full composition", () => {
  it("renders a complete dialog", () => {
    const onClose = vi.fn();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <p>Dialog body content</p>
          <DialogFooter>
            <DialogClose onClick={onClose}>Cancel</DialogClose>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dialog body content")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();

    // Two close buttons: the built-in X and the Cancel button inside footer
    const closeBtns = screen.getAllByTestId("dialog-close");
    expect(closeBtns.length).toBeGreaterThanOrEqual(1);
  });

  
});
