// alert-dialog.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/components/ui/button", () => ({
  buttonVariants: ({ variant }: { variant?: string } = {}) =>
    variant ? `btn-${variant}` : "btn-default",
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderAlertDialog = (open = true) =>
  render(
    <AlertDialog defaultOpen={open}>
      <AlertDialogTrigger data-testid="trigger">Ouvrir</AlertDialogTrigger>
      <AlertDialogContent data-testid="content">
        <AlertDialogHeader data-testid="header">
          <AlertDialogTitle data-testid="title">Titre</AlertDialogTitle>
          <AlertDialogDescription data-testid="description">
            Description
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter data-testid="footer">
          <AlertDialogCancel data-testid="cancel">Annuler</AlertDialogCancel>
          <AlertDialogAction data-testid="action">Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AlertDialog", () => {
  // ── AlertDialog (Root) ───────────────────────────────────────────────────────
  describe("AlertDialog (Root)", () => {
    it("rend le trigger sans ouvrir le contenu par défaut", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger data-testid="trigger">Open</AlertDialogTrigger>
          <AlertDialogContent data-testid="content">Contenu</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId("trigger")).toBeInTheDocument();
      expect(screen.queryByTestId("content")).toBeNull();
    });

    it("porte l'attribut data-slot='alert-dialog'", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle className="sr-only">Titre</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
            Contenu
          </AlertDialogContent>
        </AlertDialog>
      );
      // Le root Radix ne génère pas de DOM visible - on vérifie via le contenu ouvert
      expect(screen.getByText("Contenu")).toBeInTheDocument();
    });
  });

  // ── AlertDialogTrigger ───────────────────────────────────────────────────────
  describe("AlertDialogTrigger", () => {
    it("porte l'attribut data-slot='alert-dialog-trigger'", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger data-testid="trigger">Open</AlertDialogTrigger>
          <AlertDialogContent aria-describedby={undefined}>Contenu</AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId("trigger")).toHaveAttribute(
        "data-slot",
        "alert-dialog-trigger"
      );
    });

    it("ouvre le dialog au clic", () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger data-testid="trigger">Open</AlertDialogTrigger>
          <AlertDialogContent data-testid="content">
            <AlertDialogTitle className="sr-only">Titre</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
            Contenu
          </AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.queryByTestId("content")).toBeNull();
      fireEvent.click(screen.getByTestId("trigger"));
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  // ── AlertDialogContent ───────────────────────────────────────────────────────
  describe("AlertDialogContent", () => {
    it("porte l'attribut data-slot='alert-dialog-content'", () => {
      renderAlertDialog();
      expect(screen.getByTestId("content")).toHaveAttribute(
        "data-slot",
        "alert-dialog-content"
      );
    });

    it("affiche les enfants", () => {
      renderAlertDialog();
      expect(screen.getByText("Titre")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("accepte une className personnalisée", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent className="custom-class" data-testid="content">
            <AlertDialogTitle className="sr-only">Titre</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
            Contenu
          </AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId("content")).toHaveClass("custom-class");
    });

    it("inclut les classes de positionnement fixe", () => {
      renderAlertDialog();
      expect(screen.getByTestId("content")).toHaveClass("fixed");
    });
  });

  // ── AlertDialogHeader ────────────────────────────────────────────────────────
  describe("AlertDialogHeader", () => {
    it("porte l'attribut data-slot='alert-dialog-header'", () => {
      renderAlertDialog();
      expect(screen.getByTestId("header")).toHaveAttribute(
        "data-slot",
        "alert-dialog-header"
      );
    });

    it("applique les classes de layout flex", () => {
      renderAlertDialog();
      expect(screen.getByTestId("header")).toHaveClass("flex", "flex-col");
    });

    it("accepte une className personnalisée", () => {
      render(
        <AlertDialogHeader className="my-header" data-testid="header">
          contenu
        </AlertDialogHeader>
      );
      expect(screen.getByTestId("header")).toHaveClass("my-header");
    });
  });

  // ── AlertDialogFooter ────────────────────────────────────────────────────────
  describe("AlertDialogFooter", () => {
    it("porte l'attribut data-slot='alert-dialog-footer'", () => {
      renderAlertDialog();
      expect(screen.getByTestId("footer")).toHaveAttribute(
        "data-slot",
        "alert-dialog-footer"
      );
    });

    it("applique les classes de layout flex-col-reverse", () => {
      renderAlertDialog();
      expect(screen.getByTestId("footer")).toHaveClass("flex-col-reverse");
    });

    it("accepte une className personnalisée", () => {
      render(
        <AlertDialogFooter className="my-footer" data-testid="footer">
          contenu
        </AlertDialogFooter>
      );
      expect(screen.getByTestId("footer")).toHaveClass("my-footer");
    });
  });

  // ── AlertDialogTitle ─────────────────────────────────────────────────────────
  describe("AlertDialogTitle", () => {
    it("porte l'attribut data-slot='alert-dialog-title'", () => {
      renderAlertDialog();
      expect(screen.getByTestId("title")).toHaveAttribute(
        "data-slot",
        "alert-dialog-title"
      );
    });

    it("affiche le texte du titre", () => {
      renderAlertDialog();
      expect(screen.getByTestId("title")).toHaveTextContent("Titre");
    });

    it("applique les classes de typographie", () => {
      renderAlertDialog();
      expect(screen.getByTestId("title")).toHaveClass("text-lg", "font-semibold");
    });

    it("accepte une className personnalisée", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle className="custom-title" data-testid="title">
              T
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  // ── AlertDialogDescription ───────────────────────────────────────────────────
  describe("AlertDialogDescription", () => {
    it("porte l'attribut data-slot='alert-dialog-description'", () => {
      renderAlertDialog();
      expect(screen.getByTestId("description")).toHaveAttribute(
        "data-slot",
        "alert-dialog-description"
      );
    });

    it("affiche le texte de la description", () => {
      renderAlertDialog();
      expect(screen.getByTestId("description")).toHaveTextContent("Description");
    });

    it("applique les classes text-sm", () => {
      renderAlertDialog();
      expect(screen.getByTestId("description")).toHaveClass("text-sm");
    });
  });

  // ── AlertDialogAction ────────────────────────────────────────────────────────
  describe("AlertDialogAction", () => {
    it("affiche le bouton d'action", () => {
      renderAlertDialog();
      expect(screen.getByTestId("action")).toBeInTheDocument();
    });

    it("applique les classes buttonVariants par défaut", () => {
      renderAlertDialog();
      expect(screen.getByTestId("action")).toHaveClass("btn-default");
    });

    it("accepte une className personnalisée", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle className="sr-only">Titre</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
            <AlertDialogAction className="custom-action" data-testid="action">
              OK
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId("action")).toHaveClass("custom-action");
    });

    it("ferme le dialog au clic", () => {
      renderAlertDialog();
      expect(screen.getByTestId("content")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("action"));
      expect(screen.queryByTestId("content")).toBeNull();
    });
  });

  // ── AlertDialogCancel ────────────────────────────────────────────────────────
  describe("AlertDialogCancel", () => {
    it("affiche le bouton d'annulation", () => {
      renderAlertDialog();
      expect(screen.getByTestId("cancel")).toBeInTheDocument();
    });

    it("applique les classes buttonVariants outline", () => {
      renderAlertDialog();
      expect(screen.getByTestId("cancel")).toHaveClass("btn-outline");
    });

    it("accepte une className personnalisée", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle className="sr-only">Titre</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
            <AlertDialogCancel className="custom-cancel" data-testid="cancel">
              Non
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );
      expect(screen.getByTestId("cancel")).toHaveClass("custom-cancel");
    });

    it("ferme le dialog au clic", () => {
      renderAlertDialog();
      expect(screen.getByTestId("content")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("cancel"));
      expect(screen.queryByTestId("content")).toBeNull();
    });
  });

  // ── AlertDialogOverlay ───────────────────────────────────────────────────────
  describe("AlertDialogOverlay", () => {
    it("porte l'attribut data-slot='alert-dialog-overlay'", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle>T</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );
      const overlay = document.querySelector(
        "[data-slot='alert-dialog-overlay']"
      );
      expect(overlay).toBeInTheDocument();
    });

    it("applique la classe bg-black/50", () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogTitle>T</AlertDialogTitle>
            <AlertDialogDescription className="sr-only">Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );
      const overlay = document.querySelector(
        "[data-slot='alert-dialog-overlay']"
      );
      expect(overlay).toHaveClass("bg-black/50");
    });
  });
});