import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./drawer";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | false | null)[]) =>
    classes.filter(Boolean).join(" "),
}));

vi.mock("vaul", () => {
  const Root = ({
    children,
    open,
    onOpenChange,
  }: React.PropsWithChildren<{
    open?: boolean;
    onOpenChange?: (o: boolean) => void;
  }>) => (
    <div data-testid="drawer-root" data-open={open}>
      {/* Simulate trigger behaviour: expose a toggle helper via context */}
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

  const Trigger = ({
    children,
    _onOpenChange,
    ...props
  }: React.PropsWithChildren<{ _onOpenChange?: (o: boolean) => void }>) => (
    <button
      data-testid="drawer-trigger"
      onClick={() => _onOpenChange?.(true)}
      {...props}
    >
      {children}
    </button>
  );

  const Portal = ({ children }: React.PropsWithChildren) => (
    <div data-testid="drawer-portal">{children}</div>
  );

  const Close = ({
    children,
    _onOpenChange,
    ...props
  }: React.PropsWithChildren<{ _onOpenChange?: (o: boolean) => void }>) => (
    <button
      data-testid="drawer-close"
      onClick={() => _onOpenChange?.(false)}
      {...props}
    >
      {children}
    </button>
  );

  const Overlay = ({ className, ...props }: { className?: string }) => (
    <div data-testid="drawer-overlay" className={className} {...props} />
  );

  const Content = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="drawer-content" className={className} {...props}>
      {children}
    </div>
  );

  const Title = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <h2 data-testid="drawer-title" className={className} {...props}>
      {children}
    </h2>
  );

  const Description = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <p data-testid="drawer-description" className={className} {...props}>
      {children}
    </p>
  );

  return {
    Drawer: {
      Root,
      Trigger,
      Portal,
      Close,
      Overlay,
      Content,
      Title,
      Description,
    },
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Drawer", () => {
  it("renders without crashing", () => {
    render(<Drawer />);
    expect(screen.getByTestId("drawer-root")).toBeInTheDocument();
  });

  it("forwards open prop", () => {
    render(<Drawer open />);
    expect(screen.getByTestId("drawer-root")).toHaveAttribute(
      "data-open",
      "true",
    );
  });

  it("calls onOpenChange when trigger is clicked", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer onOpenChange={onOpenChange}>
        <DrawerTrigger>Open</DrawerTrigger>
      </Drawer>,
    );
    await userEvent.click(screen.getByTestId("drawer-trigger"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("DrawerTrigger", () => {
  it("renders children", () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
      </Drawer>,
    );
    expect(screen.getByText("Open Drawer")).toBeInTheDocument();
  });
});

describe("DrawerClose", () => {
  it("renders children", () => {
    render(
      <Drawer>
        <DrawerClose>Close</DrawerClose>
      </Drawer>,
    );
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when clicked", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer onOpenChange={onOpenChange}>
        <DrawerClose>Close</DrawerClose>
      </Drawer>,
    );
    await userEvent.click(screen.getByTestId("drawer-close"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("DrawerPortal", () => {
  it("renders children", () => {
    render(
      <DrawerPortal>
        <span data-testid="portal-child">portal</span>
      </DrawerPortal>,
    );
    expect(screen.getByTestId("portal-child")).toBeInTheDocument();
  });
});

describe("DrawerOverlay", () => {
  it("renders", () => {
    render(<DrawerOverlay />);
    expect(screen.getByTestId("drawer-overlay")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DrawerOverlay className="overlay-class" />);
    expect(screen.getByTestId("drawer-overlay")).toHaveClass("overlay-class");
  });
});

describe("DrawerContent", () => {
  it("renders children", () => {
    render(
      <DrawerContent>
        <span data-testid="content-child">content</span>
      </DrawerContent>,
    );
    expect(screen.getByTestId("content-child")).toBeInTheDocument();
  });

  it("renders the overlay inside the portal", () => {
    render(<DrawerContent />);
    expect(screen.getByTestId("drawer-portal")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-overlay")).toBeInTheDocument();
  });

  it("forwards className to the inner content", () => {
    render(<DrawerContent className="content-class" />);
    expect(screen.getByTestId("drawer-content")).toHaveClass("content-class");
  });

  it("renders the drag handle div", () => {
    const { container } = render(<DrawerContent />);
    // The handle is a sibling div before children inside the content
    const handle = container.querySelector(
      '[data-testid="drawer-content"] > div:first-child',
    );
    expect(handle).toBeInTheDocument();
  });
});

describe("DrawerHeader", () => {
  it("renders children", () => {
    render(<DrawerHeader>Header content</DrawerHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(<DrawerHeader>H</DrawerHeader>);
    const el = screen.getByText("H").closest("[data-slot='drawer-header']");
    expect(el).toBeInTheDocument();
  });
});

describe("DrawerFooter", () => {
  it("renders children", () => {
    render(<DrawerFooter>Footer content</DrawerFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DrawerFooter className="ftr-class">F</DrawerFooter>);
    const el = screen.getByText("F").closest("[data-slot='drawer-footer']");
    expect(el).toHaveClass("ftr-class");
  });
});

describe("DrawerTitle", () => {
  it("renders text", () => {
    render(<DrawerTitle>My Drawer</DrawerTitle>);
    expect(screen.getByText("My Drawer")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DrawerTitle className="title-class">T</DrawerTitle>);
    expect(screen.getByTestId("drawer-title")).toHaveClass("title-class");
  });
});

describe("DrawerDescription", () => {
  it("renders text", () => {
    render(<DrawerDescription>Some description</DrawerDescription>);
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(<DrawerDescription className="desc-class">D</DrawerDescription>);
    expect(screen.getByTestId("drawer-description")).toHaveClass("desc-class");
  });
});

describe("Drawer full composition", () => {
  it("renders a complete drawer", async () => {
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>Manage your preferences.</DrawerDescription>
          </DrawerHeader>
          <p>Main content here</p>
          <DrawerFooter>
            <DrawerClose>Cancel</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage your preferences.")).toBeInTheDocument();
    expect(screen.getByText("Main content here")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-overlay")).toBeInTheDocument();
  });
});
