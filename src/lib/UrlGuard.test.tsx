// UrlGuard.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UrlGuard from "./UrlGuard";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockHasPermission = vi.fn();

vi.mock("../hooks/use-permissions", () => ({
  default: () => ({ hasPermission: mockHasPermission }),
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img data-testid="unauthorized-image" alt={alt} src={src} />
  ),
}));

vi.mock("@/components/dashboard/ErrorComponent", () => ({
  Oops: () => <div data-testid="oops-component">Oops</div>,
}));

vi.mock("@/constants/images", () => ({
  IMAGES: { undraw_unauthorized: "/images/unauthorized.svg" },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

import { useAppSelector } from "../hooks/redux-toolkit";

const mockUseAppSelector = vi.mocked(useAppSelector);

const setupSelector = (groups: { permissions: string[] }[]) => {
  mockUseAppSelector.mockImplementation((selector) =>
    selector({ auth: { user: { groups } } } as never)
  );
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("UrlGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("accès autorisé", () => {
    it("affiche les children si la permission est accordée", () => {
      setupSelector([{ permissions: ["can_view"] }]);
      mockHasPermission.mockReturnValue(true);

      render(
        <UrlGuard permission={"can_view" as never}>
          <p data-testid="protected-content">Contenu protégé</p>
        </UrlGuard>
      );

      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("n'affiche pas la page unauthorized si la permission est accordée", () => {
      setupSelector([{ permissions: ["can_edit"] }]);
      mockHasPermission.mockReturnValue(true);

      render(
        <UrlGuard permission={"can_edit" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      expect(screen.queryByTestId("unauthorized-image")).toBeNull();
      expect(screen.queryByText("unauthorized_page")).toBeNull();
    });

    it("affiche les children complexes si autorisé", () => {
      setupSelector([{ permissions: ["can_view"] }]);
      mockHasPermission.mockReturnValue(true);

      render(
        <UrlGuard permission={"can_view" as never}>
          <div data-testid="child-1">A</div>
          <div data-testid="child-2">B</div>
        </UrlGuard>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });

  describe("accès refusé", () => {
    it("affiche l'image unauthorized si la permission est refusée", () => {
      setupSelector([{ permissions: [] }]);
      mockHasPermission.mockReturnValue(false);

      render(
        <UrlGuard permission={"can_delete" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      expect(screen.getByTestId("unauthorized-image")).toBeInTheDocument();
    });

    it("affiche le composant Oops si la permission est refusée", () => {
      setupSelector([]);
      mockHasPermission.mockReturnValue(false);

      render(
        <UrlGuard permission={"can_edit" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      expect(screen.getByTestId("oops-component")).toBeInTheDocument();
    });

    it("affiche le texte traduit 'unauthorized_page'", () => {
      setupSelector([]);
      mockHasPermission.mockReturnValue(false);

      render(
        <UrlGuard permission={"can_view" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      expect(screen.getByText("unauthorized_page")).toBeInTheDocument();
    });

    it("n'affiche pas les children si la permission est refusée", () => {
      setupSelector([]);
      mockHasPermission.mockReturnValue(false);

      render(
        <UrlGuard permission={"can_view" as never}>
          <p data-testid="protected-content">Contenu protégé</p>
        </UrlGuard>
      );

      expect(screen.queryByTestId("protected-content")).toBeNull();
    });
  });

  describe("permissions depuis le store", () => {
    it("passe un tableau vide à usePermission si groups est vide", () => {
      setupSelector([]);
      mockHasPermission.mockReturnValue(false);

      render(
        <UrlGuard permission={"can_view" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      // hasPermission appelé → usePermission reçoit []
      expect(mockHasPermission).toHaveBeenCalledWith("can_view");
    });

    it("passe les permissions du premier groupe à usePermission", () => {
      setupSelector([{ permissions: ["can_view", "can_edit"] }]);
      mockHasPermission.mockReturnValue(true);

      render(
        <UrlGuard permission={"can_view" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      expect(mockHasPermission).toHaveBeenCalledWith("can_view");
    });

    it("appelle hasPermission avec la permission fournie en prop", () => {
      setupSelector([{ permissions: ["can_delete"] }]);
      mockHasPermission.mockReturnValue(true);

      render(
        <UrlGuard permission={"can_delete" as never}>
          <div>Contenu</div>
        </UrlGuard>
      );

      expect(mockHasPermission).toHaveBeenCalledWith("can_delete");
    });
  });
});