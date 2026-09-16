// cn.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  describe("comportement de base", () => {
    it("retourne une chaîne vide sans arguments", () => {
      expect(cn()).toBe("");
    });

    it("retourne une classe simple", () => {
      expect(cn("flex")).toBe("flex");
    });

    it("combine plusieurs classes", () => {
      expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2");
    });
  });

  describe("clsx - valeurs conditionnelles", () => {
    it("inclut une classe si la condition est true", () => {
      expect(cn("base", true && "active")).toBe("base active");
    });

    it("ignore une classe si la condition est false", () => {
      expect(cn("base", false && "active")).toBe("base");
    });

    it("ignore les valeurs undefined et null", () => {
      expect(cn("base", undefined, null)).toBe("base");
    });

    it("gère un tableau de classes", () => {
      expect(cn(["flex", "gap-2"])).toBe("flex gap-2");
    });
  });

  describe("tailwind-merge - résolution de conflits", () => {
    it("résout un conflit de padding", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });

    it("résout un conflit de couleur de texte", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("résout un conflit de couleur de fond", () => {
      expect(cn("bg-gray-100", "bg-white")).toBe("bg-white");
    });

    it("résout un conflit de taille de texte", () => {
      expect(cn("text-sm", "text-lg")).toBe("text-lg");
    });

    it("conserve les classes non conflictuelles", () => {
      expect(cn("flex", "p-4", "p-2")).toBe("flex p-2");
    });

    it("résout un conflit avec des classes conditionnelles", () => {
      expect(cn("px-4", true && "px-2")).toBe("px-2");
    });
  });

  describe("cas combinés", () => {
    it("gère un mélange de strings, objets et tableaux", () => {
      const result = cn("flex", { "items-center": true, hidden: false }, ["gap-2"]);
      expect(result).toBe("flex items-center gap-2");
    });

    it("résout un conflit issu d'un objet conditionnel", () => {
      const result = cn("text-red-500", { "text-green-500": true });
      expect(result).toBe("text-green-500");
    });
  });
});