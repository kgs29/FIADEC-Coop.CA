import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileContentPage from "./profile-content-page";

// Mock React-i18next
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock Permission Guard
vi.mock("@/lib/PermissionGuard", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
}));

// Mock the core user API hook
const mockUseGetUserProfileQuery = vi.fn();
const mockUseChangePasswordMutation = vi.fn(() => [vi.fn(), { isLoading: false }]);
const mockUseUpdateProfileMutation = vi.fn(() => [vi.fn(), { isLoading: false }]);

vi.mock("@/store/apis/auth/authentication.api", () => ({
    useGetUserProfileQuery: () => mockUseGetUserProfileQuery(),
    useChangePasswordMutation: () => mockUseChangePasswordMutation(),
    useUpdateProfileMutation: () => mockUseUpdateProfileMutation(),
}));

describe("ProfileContentPage Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseGetUserProfileQuery.mockReturnValue({
            data: {
                id: "usr_1",
                username: "johndoe",
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                phone_number: "+1234567890",
                level: "Senior Level",
                is_superuser: true,
                is_active: true,
                is_editor: false,
                is_staff: true,
                groups: [
                    {
                        id: "grp_1",
                        name: "Administrators",
                        permissions: [
                            { id: "perm_1", codename: "can_administrate" },
                            { id: "perm_2", codename: "can_write_post" }
                        ],
                    }
                ],
                user_permissions: [1, 2], // Count metric mocked
            },
        });
    });

    it("renders correctly", () => {
        const { container } = render(<ProfileContentPage />);
        expect(container).toBeDefined();
    });

    it("displays basic user identity correctly", () => {
        render(<ProfileContentPage />);
        // Name variants
        expect(screen.getAllByText("johndoe").length).toBeGreaterThan(0);
        expect(screen.getByText("Doe")).toBeDefined();
        expect(screen.getByText("John")).toBeDefined();
        expect(screen.getByText("+1234567890")).toBeDefined();
    });

    it("displays permissions based off mapping", () => {
        render(<ProfileContentPage />);
        expect(screen.getByText("can_administrate")).toBeDefined();
        expect(screen.getByText("can_write_post")).toBeDefined();
    });

    it("renders correctly with empty groups gracefully", () => {
        mockUseGetUserProfileQuery.mockReturnValue({
            data: {
                username: "emptyUser",
                groups: [],
                user_permissions: [],
            },
        });
        const { container } = render(<ProfileContentPage />);
        expect(container).toBeDefined();
    });
});
