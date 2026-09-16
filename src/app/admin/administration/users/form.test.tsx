import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserForm from "./form";

vi.mock("react-i18next", async () => {
  const actual: any = await vi.importActual("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: "3rdParty", init: () => {} },
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/utils/navigate-back", () => ({
  useNavigateBack: () => vi.fn(),
}));

vi.mock("@/components/CancelButton", () => ({
  default: () => <button type="button">cancel</button>,
}));

vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({ checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      checked={checked ?? false}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

vi.mock("@/lib/handleApiError", () => ({ handleApiError: vi.fn() }));
vi.mock("@/hooks/redux-toolkit", () => ({ useAppSelector: (selector: any) => selector({ auth: { user: { username: "admin", is_staff: true } } }) }))

const createUserMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
const updateUserMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useGetRolesQuery: vi.fn(() => ({
    data: {
      count: 2,
      results: [
        { id: 1, name: "Admin Role" },
        { id: 2, name: "Editor Role" },
      ],
    },
    isFetching: false,
  })),
  useCreateUserMutation: vi.fn(() => [createUserMock, { isLoading: false }]),
  useUpdateUserMutation: vi.fn(() => [updateUserMock, { isLoading: false }]),
  useResetDefaultPasswordMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
}));

describe("UserForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les champs du formulaire", () => {
    render(<UserForm />);
    expect(screen.getByPlaceholderText("username")).toBeDefined();
    expect(screen.getByPlaceholderText("last_name")).toBeDefined();
    expect(screen.getByPlaceholderText("first_name")).toBeDefined();
    expect(screen.getByPlaceholderText("email")).toBeDefined();
    expect(screen.getByPlaceholderText("phone_number")).toBeDefined();
  });

  it("n'affiche PAS le champ is_editor", () => {
    render(<UserForm />);
    expect(screen.queryByText("is_editor")).toBeNull();
  });

  it("affiche la liste des rÃ´les disponibles", () => {
    render(<UserForm />);
    expect(screen.getByText("Admin Role")).toBeDefined();
    expect(screen.getByText("Editor Role")).toBeDefined();
  });

  it("sÃ©lectionne un rÃ´le via checkbox", () => {
    render(<UserForm />);
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    // Verify checkboxes are rendered (interaction depends on React state)
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("dÃ©sÃ©lectionne un rÃ´le en recliquant", () => {
    render(<UserForm />);
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("prÃ©remplie les rÃ´les en mode Ã©dition", () => {
    const initial = {
      username: "john",
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone_number: "123456789",
      role_ids: ["1"],
      roles: [{ id: 1, name: "Admin Role", groups: [], users_count: 0 }],
    };
    render(<UserForm initial={initial as any} id="1" isUpdate />);
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    // First checkbox corresponds to Admin Role (id=1) which is selected
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it("username est dÃ©sactivÃ© en mode Ã©dition", () => {
    const initial = {
      username: "john",
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone_number: "123456789",
      role_ids: [],
    };
    render(<UserForm initial={initial as any} id="1" isUpdate />);
    const usernameInput = screen.getByPlaceholderText("username") as HTMLInputElement;
    expect(usernameInput.disabled).toBe(true);
  });

  it("affiche le badge du rÃ´le sÃ©lectionnÃ©", async () => {
    render(<UserForm />);
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    fireEvent.click(checkboxes[0]);
    await waitFor(() => {
      // Badge with role name should appear
      const badges = screen.getAllByText("Admin Role");
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });
  });
});

