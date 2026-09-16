import { describe, expect, it } from "vitest";
import { AuthenticationApi } from "./apis/auth/authentication.api";
import { NotificationApi } from "./apis/core/notification.api";
import { store } from "./store";

describe("Redux Store Configuration", () => {
  it("should configure store with required reducers", () => {
    const state = store.getState();

    expect(state.auth).toBeDefined();
    expect(state.theme).toBeDefined();
    expect(state[AuthenticationApi.reducerPath]).toBeDefined();
    expect(state[NotificationApi.reducerPath]).toBeDefined();
  });

  it("should have a dispatch function", () => {
    expect(typeof store.dispatch).toBe("function");
  });
});
