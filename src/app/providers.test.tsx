import { render, waitFor } from "@testing-library/react";
import { Providers } from "./providers";
import { vi } from "vitest";
import i18n from "@/locale/i18n";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import { useLazyGetUserProfileQuery } from "@/store/apis/auth/authentication.api";



vi.mock("@/store/store", () => ({
  store: {
    dispatch: vi.fn(),
    getState: vi.fn(),
    subscribe: vi.fn(),
  },
}));

vi.mock("@/lib/applyTheme", () => ({ applyThemeConfig: vi.fn() }));

vi.mock("@/store/slices/authslice", () => ({
  loginSuccess: vi.fn((payload) => ({
    type: "loginSuccess",
    payload,
  })),
}));

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useLazyGetUserProfileQuery: vi.fn(),
}));

vi.mock("@/store/apis/core/configuration.api", () => ({
  useGetConfigurationQuery: vi.fn(() => ({ data: {}, isSuccess: true, isError: false })),
  ConfigurationApi: { util: { updateQueryData: vi.fn() } },
}));

vi.mock("@/hooks/redux-toolkit", () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock("@/locale/i18n", () => ({
  default: {
    changeLanguage: vi.fn(),
  },
}));



describe("Providers", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    (useAppDispatch as any).mockReturnValue(vi.fn());
    (useLazyGetUserProfileQuery as any).mockReturnValue([
      vi.fn(),
      { data: null },
    ]);

    const { getByText } = render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    expect(getByText("child")).toBeInTheDocument();
  });

  it("calls getProfile if token exists", async () => {
    localStorage.setItem("access", "token123");

    const getProfileMock = vi.fn();

    (useAppDispatch as any).mockReturnValue(vi.fn());

    (useLazyGetUserProfileQuery as any).mockReturnValue([
      getProfileMock,
      { data: null },
    ]);

    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    await waitFor(() => {
      expect(getProfileMock).toHaveBeenCalled();
    });
  });

  it("changes language from localStorage", async () => {
    localStorage.setItem("language", "en");

    (useAppDispatch as any).mockReturnValue(vi.fn());

    (useLazyGetUserProfileQuery as any).mockReturnValue([
      vi.fn(),
      { data: null },
    ]);

    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    await waitFor(() => {
      expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
    });
  });

  it("defaults language to fr when none in storage", async () => {
    (useAppDispatch as any).mockReturnValue(vi.fn());

    (useLazyGetUserProfileQuery as any).mockReturnValue([
      vi.fn(),
      { data: null },
    ]);

    render(
      <Providers>
        <div>child</div>
      </Providers>
    );

    await waitFor(() => {
      expect(i18n.changeLanguage).toHaveBeenCalledWith("fr");
    });
  });
});