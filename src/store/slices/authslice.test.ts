// authSlice.test.ts
import { describe, it, expect } from "vitest";
import reducer, { loginSuccess, logout } from "./authslice";
import { User } from "../../types/auth.types";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockUser: User = {
  id: "42",
  is_superuser: true,
  username: "alice",
  is_staff: true,
  is_active: true,
  last_name: "Dupont",
  email: "alice@example.com",
  groups: [],
  otp: "123456",
  phone_number: "+33600000000",
  level: "admin",
  user_permissions: [],
  last_login: null,
  date_joined: "2024-01-01T00:00:00Z" as unknown as Date,
  first_name: null,
  is_editor: true,
};

const initialState = {
  user: {
    id: "",
    is_superuser: false,
    username: "",
    is_staff: false,
    is_active: false,
    last_name: "",
    email: "",
    groups: [],
    otp: "",
    phone_number: "",
    level: "",
    user_permissions: [],
    last_login: null,
    date_joined: "2024-12-06T12:00:00Z",
    first_name: null,
    is_editor: false,
  },
  isLoggedIn: false,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("authSlice", () => {
  describe("état initial", () => {
    it("retourne l'état initial si undefined", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.isLoggedIn).toBe(false);
      expect(state.user.username).toBe("");
      expect(state.user.id).toBe("");
    });

    it("isLoggedIn est false par défaut", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.isLoggedIn).toBe(false);
    });

    it("user est vide par défaut", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.user.email).toBe("");
      expect(state.user.groups).toEqual([]);
    });
  });

  describe("loginSuccess", () => {
    it("met à jour le state avec le payload", () => {
      const payload = { user: mockUser, isLoggedIn: true };
      const state = reducer(initialState as never, loginSuccess(payload));
      expect(state.user).toEqual(mockUser);
      expect(state.isLoggedIn).toBe(true);
    });

    it("passe isLoggedIn à true", () => {
      const state = reducer(initialState as never, loginSuccess({ user: mockUser, isLoggedIn: true }));
      expect(state.isLoggedIn).toBe(true);
    });

    it("conserve toutes les propriétés du user", () => {
      const state = reducer(initialState as never, loginSuccess({ user: mockUser, isLoggedIn: true }));
      expect(state.user.username).toBe("alice");
      expect(state.user.email).toBe("alice@example.com");
      expect(state.user.is_superuser).toBe(true);
      expect(state.user.groups).toEqual([]);
    });

    it("ne mute pas l'état précédent", () => {
      const prevState = { ...initialState };
      reducer(prevState as never, loginSuccess({ user: mockUser, isLoggedIn: true }));
      expect(prevState.isLoggedIn).toBe(false);
    });
  });

  describe("logout", () => {
    it("remet isLoggedIn à false", () => {
      const loggedInState = { user: mockUser, isLoggedIn: true };
      const state = reducer(loggedInState as never, logout());
      expect(state.isLoggedIn).toBe(false);
    });

    it("remet le user à l'état initial", () => {
      const loggedInState = { user: mockUser, isLoggedIn: true };
      const state = reducer(loggedInState as never, logout());
      expect(state.user.username).toBe("");
      expect(state.user.id).toBe("");
      expect(state.user.email).toBe("");
      expect(state.user.groups).toEqual([]);
    });

    it("remet toutes les propriétés booléennes à false", () => {
      const loggedInState = { user: mockUser, isLoggedIn: true };
      const state = reducer(loggedInState as never, logout());
      expect(state.user.is_superuser).toBe(false);
      expect(state.user.is_staff).toBe(false);
      expect(state.user.is_active).toBe(false);
      expect(state.user.is_editor).toBe(false);
    });

    it("ne mute pas l'état précédent", () => {
      const loggedInState = { user: mockUser, isLoggedIn: true };
      reducer(loggedInState as never, logout());
      expect(loggedInState.isLoggedIn).toBe(true);
    });
  });

  describe("action inconnue", () => {
    it("retourne l'état inchangé pour une action inconnue", () => {
      const state = reducer(initialState as never, { type: "unknown/action" });
      expect(state).toEqual(initialState);
    });
  });
});