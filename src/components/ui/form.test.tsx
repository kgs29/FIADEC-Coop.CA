import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "./form";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | false | null)[]) =>
    classes.filter(Boolean).join(" "),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/ui/label", () => {
  const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
  >(({ children, className, ...props }, ref) => (
    <label ref={ref} className={className} data-testid="label" {...props}>
      {children}
    </label>
  ));
  Label.displayName = "Label";
  return { Label };
});

vi.mock("@radix-ui/react-slot", () => {
  const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ children, ...props }, ref) => (
      <div ref={ref as React.Ref<HTMLDivElement>} data-testid="slot" {...props}>
        {children}
      </div>
    ),
  );
  Slot.displayName = "Slot";
  return { Slot };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wraps a subtree inside a fully-wired form so that useFormField() context
 * (FormFieldContext + FormItemContext + react-hook-form) is available.
 */
function FormWrapper({
  children,
  defaultValues = { name: "" },
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues });
  return (
    <Form {...methods}>
      <form>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(
                  child as React.ReactElement<{ field?: typeof field }>,
                  { field },
                );
              })}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FormItem", () => {
  it("renders a div with data-slot=form-item", () => {
    render(
      <FormWrapper>
        <span data-testid="child">hi</span>
      </FormWrapper>,
    );
    const item = document.querySelector("[data-slot='form-item']");
    expect(item).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(
      <FormWrapper>
        <FormItem className="custom-class">
          <span>content</span>
        </FormItem>
      </FormWrapper>,
    );
    const items = document.querySelectorAll("[data-slot='form-item']");
    const withClass = Array.from(items).find((el) =>
      el.classList.contains("custom-class"),
    );
    expect(withClass).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <FormWrapper>
        <span data-testid="form-item-child">hello</span>
      </FormWrapper>,
    );
    expect(screen.getByTestId("form-item-child")).toBeInTheDocument();
  });
});

describe("FormLabel", () => {
  it("renders label text", () => {
    render(
      <FormWrapper>
        <FormLabel>Username</FormLabel>
      </FormWrapper>,
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders required asterisk when required prop is true", () => {
    render(
      <FormWrapper>
        <FormLabel required>Email</FormLabel>
      </FormWrapper>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not render asterisk when required is false", () => {
    render(
      <FormWrapper>
        <FormLabel>Email</FormLabel>
      </FormWrapper>,
    );
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("forwards className", () => {
    render(
      <FormWrapper>
        <FormLabel className="lbl-class">Label</FormLabel>
      </FormWrapper>,
    );
    expect(screen.getByTestId("label")).toHaveClass("lbl-class");
  });

  it("links label to form item via htmlFor", () => {
    render(
      <FormWrapper>
        <FormLabel>Field</FormLabel>
        <FormControl>
          <input />
        </FormControl>
      </FormWrapper>,
    );
    const label = screen.getByTestId("label");
    const slot = screen.getByTestId("slot");
    expect(label).toHaveAttribute("for", slot.id);
  });
});

describe("FormControl", () => {
  it("renders via Slot", () => {
    render(
      <FormWrapper>
        <FormControl>
          <input data-testid="input" />
        </FormControl>
      </FormWrapper>,
    );
    expect(screen.getByTestId("slot")).toBeInTheDocument();
  });

  it("sets aria-invalid=false when no error", () => {
    render(
      <FormWrapper>
        <FormControl>
          <input />
        </FormControl>
      </FormWrapper>,
    );
    expect(screen.getByTestId("slot")).toHaveAttribute("aria-invalid", "false");
  });

  it("sets aria-describedby", () => {
    render(
      <FormWrapper>
        <FormControl>
          <input />
        </FormControl>
      </FormWrapper>,
    );
    const slot = screen.getByTestId("slot");
    expect(slot).toHaveAttribute("aria-describedby");
  });
});

describe("FormDescription", () => {
  it("renders description text", () => {
    render(
      <FormWrapper>
        <FormDescription>Enter your username.</FormDescription>
      </FormWrapper>,
    );
    expect(screen.getByText("Enter your username.")).toBeInTheDocument();
  });

  it("has data-slot=form-description", () => {
    render(
      <FormWrapper>
        <FormDescription>Hint</FormDescription>
      </FormWrapper>,
    );
    expect(
      document.querySelector("[data-slot='form-description']"),
    ).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(
      <FormWrapper>
        <FormDescription className="desc-class">Hint</FormDescription>
      </FormWrapper>,
    );
    expect(screen.getByText("Hint")).toHaveClass("desc-class");
  });

  it("uses formDescriptionId as its id", () => {
    render(
      <FormWrapper>
        <FormDescription>Desc</FormDescription>
        <FormControl>
          <input />
        </FormControl>
      </FormWrapper>,
    );
    const desc = screen.getByText("Desc");
    const slot = screen.getByTestId("slot");
    expect(slot.getAttribute("aria-describedby")).toContain(desc.id);
  });
});

describe("FormMessage", () => {
  it("renders nothing when no error and no children", () => {
    render(
      <FormWrapper>
        <FormMessage />
      </FormWrapper>,
    );
    expect(document.querySelector("[id$='-form-item-message']")).toBeNull();
  });

  it("renders children when provided and no error", () => {
    render(
      <FormWrapper>
        <FormMessage>Helper text</FormMessage>
      </FormWrapper>,
    );
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("forwards className", () => {
    render(
      <FormWrapper>
        <FormMessage className="msg-class">Note</FormMessage>
      </FormWrapper>,
    );
    expect(screen.getByText("Note")).toHaveClass("msg-class");
  });

  it("renders error message when form has a validation error", async () => {
    function ErrorForm() {
      const methods = useForm({ defaultValues: { name: "" } });

      React.useEffect(() => {
        methods.setError("name", { message: "Name is required" });
      }, [methods]);

      return (
        <Form {...methods}>
          <form>
            <FormField
              control={methods.control}
              name="name"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    }

    render(<ErrorForm />);
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
  });
});

describe("useFormField", () => {
  it("throws when used outside FormField", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <FormItem>
          {(() => {
            const Inner = () => {
              useFormField();
              return null;
            };
            return <Inner />;
          })()}
        </FormItem>,
      ),
    ).toThrow();
    spy.mockRestore();
  });
});
