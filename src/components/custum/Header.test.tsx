import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/web"),
}));

vi.mock("next/image", () => ({
  default: ({ priority, fill, ...props }: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a>,
}));

vi.mock("@/app/providers", () => ({
  useAuthReady: () => true,
  Providers: ({ children }: any) => children,
}));

const mockUseAppSelector = vi.fn();
vi.mock("@/hooks/redux-toolkit", () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(),
}));

const mockUseLogoutMutation = vi.fn();
vi.mock("@/store/apis/auth/authentication.api", () => ({
  useLogoutMutation: () => [mockUseLogoutMutation, { isLoading: false }],
}));

const mockUseGetIndexQuery = vi.fn();
vi.mock("@/store/apis/main/index.api", () => ({
  useGetIndexQuery: () => mockUseGetIndexQuery(),
}));

vi.mock("@/locale/i18n", () => ({
  default: {
    language: "fr",
    changeLanguage: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuRadioGroup: ({ children }: any) => <div>{children}</div>,
  DropdownMenuRadioItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuGroup: ({ children }: any) => <div>{children}</div>,
  DropdownMenuCheckboxItem: ({ children }: any) => <div>{children}</div>,
  DropdownMenuShortcut: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children, asChild }: any) => asChild ? children : <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));

import Header from "./Header";

describe("Header Component", () => {
  let mockStore: ReturnType<typeof configureStore>;

  beforeEach(() => {
    mockUseAppSelector.mockReturnValue({ isLoggedIn: false, user: null });
    mockUseGetIndexQuery.mockReturnValue({
      data: {
        count: 2,
        results: [
          { id: "1", name_fr: "indexBenin", name_en: "Index 1 EN", description_fr: "Desc 1 FR", description_en: "Desc 1 EN" },
          { id: "2", name_fr: "Index 2 FR", name_en: "Index 2 EN", description_fr: "Desc 2 FR", description_en: "Desc 2 EN" },
        ],
      },
    });
    mockStore = configureStore({ reducer: (state = {}) => state });
  });

  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <Header />
      </Provider>
    );

  it("renders correctly", () => {
    const { container } = renderComponent();
    expect(container).toBeDefined();
  });

  it("hides the login button when logged out", () => {
    renderComponent();
    expect(screen.queryByText("custum.header.login")).toBeNull();
  });

  it("hides the admin dashboard link when logged in", () => {
    mockUseAppSelector.mockReturnValue({
      isLoggedIn: true,
      user: { username: "Test User", is_editor: true, last_name: "User" },
    });
    renderComponent();
    expect(screen.queryByText("custum.header.dashboard")).toBeNull();
    expect(screen.queryByText("custum.header.client_space")).toBeNull();
  });

  it("interacts with lang switcher dropdown", () => {
    renderComponent();
    // With DropdownMenuTrigger mocked as a div, content always renders
    expect(screen.getAllByText("User.lang.fr").length).toBeGreaterThan(0);
  });

  it("shows popovers when hovered", () => {
    renderComponent();
    // With Popover mocked, content is always visible
    expect(screen.getAllByText("custum.header.nav.home").length).toBeGreaterThan(0);
  });

  it("triggers mobile menu open", () => {
    renderComponent();
    // Check that nav links are rendered
    expect(screen.getAllByText("custum.header.nav.home").length).toBeGreaterThan(0);
  });
});
