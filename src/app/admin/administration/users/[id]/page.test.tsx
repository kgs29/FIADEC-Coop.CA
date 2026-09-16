import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import UserDetails from "./page";

// Fix IntersectionObserver LOCAL
beforeAll(() => {
  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.IntersectionObserver = IntersectionObserverMock as any;
});

// mocks
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/admin/administration/users/1",
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/components/AuditTimeline", () => ({
  AuditTimeline: () => <div>AuditTimeline</div>,
}));

vi.mock("@/components/dashboard/ErrorComponent", () => ({
  default: () => <div>Error</div>,
}));

vi.mock("@/lib/PermissionGuard", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/lib/UrlGuard", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

// mock API dynamique
const mockApi = {
  data: null as any,
  isFetching: false,
  error: null as any,
};

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetSingleUserQuery: () => mockApi,
  useDeleteUserMutation: () => [vi.fn(), { isLoading: false }],
  useSetUserStatusMutation: () => [vi.fn(), { isLoading: false }],
  useGetItemActivityLogQuery: () => ({ data: undefined, isLoading: false }),
}));

describe("UserDetails", () => {
  beforeEach(() => {
    mockApi.data = {
      id: "1",
      username: "john",
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone_number: "123456",
      level: "admin",
      is_active: true,
      is_editor: false,
      groups: [{ name: "Admin", permissions: [] }],
      history_datas: [],
    };
    mockApi.isFetching = false;
    mockApi.error = null;
  });

  it("affiche les infos utilisateur", () => {
    render(<UserDetails />);

    expect(
        screen.getAllByText("john", { selector: "label" })[0]
        ).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
  });

  it("affiche loader si fetching", () => {
    mockApi.isFetching = true;

    render(<UserDetails />);

    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("affiche erreur si error", () => {
    mockApi.error = { message: "error" };

    render(<UserDetails />);

    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});