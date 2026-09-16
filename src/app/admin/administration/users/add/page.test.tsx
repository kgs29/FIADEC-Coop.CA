// 1️⃣ Mock avant tout import réel
vi.mock("../form", () => ({ default: () => <div data-testid="user-form" /> }));
vi.mock("@/lib/UrlGuard", () => ({ default: ({ children }: any) => <div data-testid="url-guard">{children}</div> }));

// 2️⃣ Import réel après les mocks
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddPage from "./page";
import authReducer from "@/store/slices/authslice.ts";

// Store minimal
const store = configureStore({
  reducer: { auth: authReducer },
});

describe("AddPage", () => {
  it("renders UrlGuard with permission and UserForm inside", () => {
    render(
      <Provider store={store}>
        <AddPage />
      </Provider>
    );

    expect(screen.getByTestId("url-guard")).toBeInTheDocument();
    expect(screen.getByTestId("user-form")).toBeInTheDocument();
  });
});