// themeSlice.test.ts
import { describe, it, expect } from "vitest";
import reducer, { toogleNavOpen, toogleNavExpend } from "./themeSlice";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const initialState = {
  navOpen: true,
  navExpend: false,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("themeSlice", () => {
  describe("état initial", () => {
    it("retourne l'état initial si undefined", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state).toEqual(initialState);
    });

    it("navOpen est true par défaut", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.navOpen).toBe(true);
    });

    it("navExpend est false par défaut", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.navExpend).toBe(false);
    });
  });

  describe("toogleNavOpen", () => {
    it("passe navOpen de true à false", () => {
      const state = reducer(initialState, toogleNavOpen());
      expect(state.navOpen).toBe(false);
    });

    it("passe navOpen de false à true", () => {
      const state = reducer({ ...initialState, navOpen: false }, toogleNavOpen());
      expect(state.navOpen).toBe(true);
    });

    it("ne modifie pas navExpend", () => {
      const state = reducer(initialState, toogleNavOpen());
      expect(state.navExpend).toBe(initialState.navExpend);
    });

    it("deux toggles successifs restituent la valeur initiale", () => {
      const once = reducer(initialState, toogleNavOpen());
      const twice = reducer(once, toogleNavOpen());
      expect(twice.navOpen).toBe(initialState.navOpen);
    });
  });

  describe("toogleNavExpend", () => {
    it("passe navExpend de false à true", () => {
      const state = reducer(initialState, toogleNavExpend());
      expect(state.navExpend).toBe(true);
    });

    it("passe navExpend de true à false", () => {
      const state = reducer({ ...initialState, navExpend: true }, toogleNavExpend());
      expect(state.navExpend).toBe(false);
    });

    it("ne modifie pas navOpen", () => {
      const state = reducer(initialState, toogleNavExpend());
      expect(state.navOpen).toBe(initialState.navOpen);
    });

    it("deux toggles successifs restituent la valeur initiale", () => {
      const once = reducer(initialState, toogleNavExpend());
      const twice = reducer(once, toogleNavExpend());
      expect(twice.navExpend).toBe(initialState.navExpend);
    });
  });

  describe("action inconnue", () => {
    it("retourne l'état inchangé pour une action inconnue", () => {
      const state = reducer(initialState, { type: "unknown/action" });
      expect(state).toEqual(initialState);
    });
  });
});