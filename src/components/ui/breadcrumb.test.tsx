// breadcrumb.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="slot" {...props}>
      {children}
    </div>
  ),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Breadcrumb", () => {
  // ── Breadcrumb (nav) ─────────────────────────────────────────────────────────
  describe("Breadcrumb", () => {
    it("rend un élément <nav>", () => {
      render(<Breadcrumb data-testid="nav" />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("porte aria-label='breadcrumb'", () => {
      render(<Breadcrumb />);
      expect(screen.getByRole("navigation")).toHaveAttribute(
        "aria-label",
        "breadcrumb",
      );
    });

    it("porte data-slot='breadcrumb'", () => {
      render(<Breadcrumb data-testid="nav" />);
      expect(screen.getByTestId("nav")).toHaveAttribute(
        "data-slot",
        "breadcrumb",
      );
    });

    it("transmet les props supplémentaires", () => {
      render(<Breadcrumb data-testid="nav" id="main-breadcrumb" />);
      expect(screen.getByTestId("nav")).toHaveAttribute(
        "id",
        "main-breadcrumb",
      );
    });
  });

  // ── BreadcrumbList ───────────────────────────────────────────────────────────
  describe("BreadcrumbList", () => {
    it("rend un élément <ol>", () => {
      const { container } = render(<BreadcrumbList />);
      expect(container.querySelector("ol")).toBeInTheDocument();
    });

    it("porte data-slot='breadcrumb-list'", () => {
      render(<BreadcrumbList data-testid="list" />);
      expect(screen.getByTestId("list")).toHaveAttribute(
        "data-slot",
        "breadcrumb-list",
      );
    });

    it("applique les classes de layout flex", () => {
      render(<BreadcrumbList data-testid="list" />);
      expect(screen.getByTestId("list")).toHaveClass(
        "flex",
        "flex-wrap",
        "items-center",
      );
    });

    it("accepte une className personnalisée", () => {
      render(<BreadcrumbList className="custom" data-testid="list" />);
      expect(screen.getByTestId("list")).toHaveClass("custom");
    });
  });

  // ── BreadcrumbItem ───────────────────────────────────────────────────────────
  describe("BreadcrumbItem", () => {
    it("rend un élément <li>", () => {
      const { container } = render(<BreadcrumbItem />);
      expect(container.querySelector("li")).toBeInTheDocument();
    });

    it("porte data-slot='breadcrumb-item'", () => {
      render(<BreadcrumbItem data-testid="item" />);
      expect(screen.getByTestId("item")).toHaveAttribute(
        "data-slot",
        "breadcrumb-item",
      );
    });

    it("applique les classes inline-flex", () => {
      render(<BreadcrumbItem data-testid="item" />);
      expect(screen.getByTestId("item")).toHaveClass(
        "inline-flex",
        "items-center",
      );
    });

    it("accepte une className personnalisée", () => {
      render(<BreadcrumbItem className="custom" data-testid="item" />);
      expect(screen.getByTestId("item")).toHaveClass("custom");
    });

    it("affiche ses enfants", () => {
      render(<BreadcrumbItem>Accueil</BreadcrumbItem>);
      expect(screen.getByText("Accueil")).toBeInTheDocument();
    });
  });

  // ── BreadcrumbLink ───────────────────────────────────────────────────────────
  describe("BreadcrumbLink", () => {
    it("rend un élément <a> par défaut", () => {
      render(
        <BreadcrumbLink href="/home" data-testid="link">
          Accueil
        </BreadcrumbLink>,
      );
      expect(screen.getByTestId("link").tagName).toBe("A");
    });

    it("porte data-slot='breadcrumb-link'", () => {
      render(<BreadcrumbLink data-testid="link">Accueil</BreadcrumbLink>);
      expect(screen.getByTestId("link")).toHaveAttribute(
        "data-slot",
        "breadcrumb-link",
      );
    });

    it("applique la classe hover:text-foreground", () => {
      render(<BreadcrumbLink data-testid="link">Accueil</BreadcrumbLink>);
      expect(screen.getByTestId("link")).toHaveClass("hover:text-foreground");
    });

    it("accepte une className personnalisée", () => {
      render(
        <BreadcrumbLink className="custom" data-testid="link">
          Accueil
        </BreadcrumbLink>,
      );
      expect(screen.getByTestId("link")).toHaveClass("custom");
    });

    it("transmet href correctement", () => {
      render(
        <BreadcrumbLink href="/about" data-testid="link">
          À propos
        </BreadcrumbLink>,
      );
      expect(screen.getByTestId("link")).toHaveAttribute("href", "/about");
    });
  });

  // ── BreadcrumbPage ───────────────────────────────────────────────────────────
  describe("BreadcrumbPage", () => {
    it("rend un élément <span>", () => {
      const { container } = render(<BreadcrumbPage>Page</BreadcrumbPage>);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("porte data-slot='breadcrumb-page'", () => {
      render(<BreadcrumbPage data-testid="page">Page</BreadcrumbPage>);
      expect(screen.getByTestId("page")).toHaveAttribute(
        "data-slot",
        "breadcrumb-page",
      );
    });

    it("porte role='link'", () => {
      render(<BreadcrumbPage>Page</BreadcrumbPage>);
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("porte aria-disabled='true'", () => {
      render(<BreadcrumbPage data-testid="page">Page</BreadcrumbPage>);
      expect(screen.getByTestId("page")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("porte aria-current='page'", () => {
      render(<BreadcrumbPage data-testid="page">Page</BreadcrumbPage>);
      expect(screen.getByTestId("page")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });

    it("applique les classes text-foreground font-normal", () => {
      render(<BreadcrumbPage data-testid="page">Page</BreadcrumbPage>);
      expect(screen.getByTestId("page")).toHaveClass(
        "text-foreground",
        "font-normal",
      );
    });

    it("accepte une className personnalisée", () => {
      render(
        <BreadcrumbPage className="custom" data-testid="page">
          Page
        </BreadcrumbPage>,
      );
      expect(screen.getByTestId("page")).toHaveClass("custom");
    });
  });

  // ── BreadcrumbSeparator ──────────────────────────────────────────────────────
  describe("BreadcrumbSeparator", () => {
    it("rend un élément <li>", () => {
      const { container } = render(
        <BreadcrumbList>
          <BreadcrumbSeparator />
        </BreadcrumbList>,
      );
      expect(
        container.querySelector("li[data-slot='breadcrumb-separator']"),
      ).toBeInTheDocument();
    });

    it("porte data-slot='breadcrumb-separator'", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>,
      );
      expect(screen.getByTestId("sep")).toHaveAttribute(
        "data-slot",
        "breadcrumb-separator",
      );
    });

    it("porte role='presentation' et aria-hidden='true'", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbSeparator data-testid="sep" />
        </BreadcrumbList>,
      );
      const sep = screen.getByTestId("sep");
      expect(sep).toHaveAttribute("role", "presentation");
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });

    it("affiche ChevronRight par défaut", () => {
      const { container } = render(
        <BreadcrumbList>
          <BreadcrumbSeparator />
        </BreadcrumbList>,
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("affiche un children personnalisé à la place de ChevronRight", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbSeparator data-testid="sep">/</BreadcrumbSeparator>
        </BreadcrumbList>,
      );
      expect(screen.getByTestId("sep")).toHaveTextContent("/");
    });

    it("accepte une className personnalisée", () => {
      render(
        <BreadcrumbList>
          <BreadcrumbSeparator className="custom" data-testid="sep" />
        </BreadcrumbList>,
      );
      expect(screen.getByTestId("sep")).toHaveClass("custom");
    });
  });

  // ── BreadcrumbEllipsis ───────────────────────────────────────────────────────
  describe("BreadcrumbEllipsis", () => {
    it("rend un élément <span>", () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);
      expect(screen.getByTestId("ellipsis").tagName).toBe("SPAN");
    });

    it("porte data-slot='breadcrumb-ellipsis'", () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);
      expect(screen.getByTestId("ellipsis")).toHaveAttribute(
        "data-slot",
        "breadcrumb-ellipsis",
      );
    });

    it("porte role='presentation' et aria-hidden='true'", () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);
      const el = screen.getByTestId("ellipsis");
      expect(el).toHaveAttribute("role", "presentation");
      expect(el).toHaveAttribute("aria-hidden", "true");
    });

    it("affiche le texte sr-only 'More'", () => {
      render(<BreadcrumbEllipsis />);
      expect(screen.getByText("More")).toHaveClass("sr-only");
    });

    it("affiche l'icône MoreHorizontal", () => {
      const { container } = render(<BreadcrumbEllipsis />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("applique les classes size-9 flex", () => {
      render(<BreadcrumbEllipsis data-testid="ellipsis" />);
      expect(screen.getByTestId("ellipsis")).toHaveClass("flex", "size-9");
    });

    it("accepte une className personnalisée", () => {
      render(<BreadcrumbEllipsis className="custom" data-testid="ellipsis" />);
      expect(screen.getByTestId("ellipsis")).toHaveClass("custom");
    });
  });

  // ── Composition complète ─────────────────────────────────────────────────────
  describe("Composition complète", () => {
    it("rend un fil d'Ariane complet", () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Page courante</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByText("Accueil")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Page courante")).toBeInTheDocument();
    });
  });
});
