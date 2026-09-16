import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockCreateRole = vi.fn(() => ({ unwrap: () => Promise.resolve({ id: 1, name: "Test" }) }));
const mockUpdateRole = vi.fn(() => ({ unwrap: () => Promise.resolve({ id: 1, name: "Updated" }) }));
const mockNavigateBack = vi.fn();

vi.mock("@/store/apis/auth/authentication.api", () => ({
  useCreateRoleMutation: vi.fn(() => [mockCreateRole, { isLoading: false }]),
  useUpdateRoleMutation: vi.fn(() => [mockUpdateRole, { isLoading: false }]),
  useUpdateRuleMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
  useGetRulesQuery: vi.fn(() => ({
    data: {
      count: 2,
      results: [
        { id: 1, name: "Group A", permissions: [{ id: 1, codename: "view_user", name: "Can view user" }] },
        { id: 2, name: "Group B", permissions: [] },
      ],
    },
    isFetching: false,
  })),
  useGetPermissionsQuery: vi.fn(() => ({ data: [] })),
}));

vi.mock("@/utils/navigate-back", () => ({
  useNavigateBack: () => mockNavigateBack,
}));

vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

import RoleForm from "./form";

describe("RoleForm", () => {
  beforeEach(() => {
    mockCreateRole.mockClear();
    mockUpdateRole.mockClear();
    mockNavigateBack.mockClear();
  });

  it("renders name input", () => {
    render(<RoleForm />);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
  });

  it("renders available groups as checkboxes", () => {
    render(<RoleForm />);
    expect(screen.getByText("Group A")).toBeDefined();
    expect(screen.getByText("Group B")).toBeDefined();
  });

  it("shows permission preview for groups", () => {
    render(<RoleForm />);
    expect(screen.getByText(/view_user/)).toBeDefined();
  });

  it("shows initial group as checked when editing", () => {
    const initial = {
      id: 10,
      name: "Existing Role",
      groups: [{ id: 1, name: "Group A" }],
      users_count: 0,
    };
    render(<RoleForm initial={initial as any} id={10} isUpdate />);
    const checkboxes = screen.getAllByRole("checkbox");
    const checkedGroupA = checkboxes.find((cb) => cb.getAttribute("data-state") === "checked" || cb.getAttribute("aria-checked") === "true");
    expect(checkedGroupA).toBeTruthy();
  });

  it("submits create with correct payload", async () => {
    render(<RoleForm />);
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "New Role" } });
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    const form = document.querySelector("form");
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(mockCreateRole).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Role", group_ids: [1] })
      );
    });
  });

  it("calls updateRole when isUpdate is true", async () => {
    const initial = {
      id: 5,
      name: "Old Name",
      groups: [{ id: 2, name: "Group B" }],
      users_count: 1,
    };
    render(<RoleForm initial={initial as any} id={5} isUpdate />);
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "New Name" } });
    const form = document.querySelector("form");
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(mockUpdateRole).toHaveBeenCalled();
    });
  });

  it("shows error toast if name is empty on submit", async () => {
    const toast = await import("react-hot-toast");
    render(<RoleForm />);
    const form = document.querySelector("form");
    if (form) fireEvent.submit(form);
    await waitFor(() => {
      expect(vi.mocked(toast.default.error)).toHaveBeenCalled();
    });
  });
});
