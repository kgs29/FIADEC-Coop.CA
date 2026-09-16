import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotificationContentPage from "./notifications-content-page";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

const mockMarkMutation = vi.hoisted(() => vi.fn());
const mockUseGetUserNotificationsQuery = vi.hoisted(() => vi.fn());

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }: any) => (
    <button data-testid="mark-all-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children }: any) => (
    <label data-testid="notification-label">{children}</label>
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock("@/lib/PermissionGuard", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/store/apis/core/notification.api", () => ({
  useGetUserNotificationsQuery: mockUseGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation: () => [
    mockMarkMutation,
    { isLoading: false },
  ],
}));

vi.mock("react-hot-toast", () => ({ default: mockToast }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("lucide-react", () => ({
  Bell: () => <span data-testid="icon-bell" />,
  CheckCheck: () => <span data-testid="icon-check" />,
  Clock: () => <span data-testid="icon-clock" />,
  Loader: () => <span data-testid="icon-loader" />,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeNotif = (overrides = {}): any => ({
  id: "1",
  message: "Test notification",
  is_read: false,
  created_at: "2024-01-15T10:30:00Z",
  ...overrides,
});

const mockNotifications = (results: any[]) =>
  mockUseGetUserNotificationsQuery.mockReturnValue({
    data: { results },
  });

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("NotificationContentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNotifications([]);
  });

  // ── Rendu initial ────────────────────────────────────────────────────────

  describe("initial render", () => {
    it("renders without crashing", () => {
      render(<NotificationContentPage />);
      expect(screen.getAllByTestId("notification-label")[0]).toBeDefined();
    });

    it("renders the notification list label with unread count", () => {
      mockNotifications([
        makeNotif({ is_read: false }),
        makeNotif({ id: "2", is_read: true }),
      ]);
      render(<NotificationContentPage />);
      expect(screen.getAllByTestId("notification-label")[0].textContent).toContain(
        "notificationUnreadList",
      );
      expect(screen.getAllByTestId("notification-label")[0].textContent).toContain(
        "1",
      );
    });

    it("shows count 0 when all notifications are read", () => {
      mockNotifications([makeNotif({ is_read: true })]);
      render(<NotificationContentPage />);
      expect(screen.getAllByTestId("notification-label")[0].textContent).toContain(
        "0",
      );
    });

    it("shows count 0 when there are no notifications", () => {
      mockNotifications([]);
      render(<NotificationContentPage />);
      expect(screen.getAllByTestId("notification-label")[0].textContent).toContain(
        "0",
      );
    });
  });

  // ── Rendu des notifications ──────────────────────────────────────────────

  describe("notification list", () => {
    it("renders each notification message", () => {
      mockNotifications([
        makeNotif({ id: "1", message: "First message" }),
        makeNotif({ id: "2", message: "Second message" }),
      ]);
      render(<NotificationContentPage />);
      expect(screen.getByText("First message")).toBeDefined();
      expect(screen.getByText("Second message")).toBeDefined();
    });

    it("renders a separator for each notification", () => {
      mockNotifications([makeNotif({ id: "1" }), makeNotif({ id: "2" })]);
      render(<NotificationContentPage />);
      expect(screen.getAllByTestId("separator").length).toBe(2);
    });

    it("renders bell icons for each notification", () => {
      mockNotifications([makeNotif({ id: "1" }), makeNotif({ id: "2" })]);
      render(<NotificationContentPage />);
      expect(screen.getAllByTestId("icon-bell").length).toBe(2);
    });

    it("renders nothing in the list when data is undefined", () => {
      mockUseGetUserNotificationsQuery.mockReturnValue({ data: undefined });
      render(<NotificationContentPage />);
      expect(screen.queryByTestId("separator")).toBeNull();
    });
  });

  // ── Bouton "mark all as read" ────────────────────────────────────────────

  describe("mark all as read button", () => {
    it("shows mark all button when there are unread notifications", () => {
      mockNotifications([makeNotif({ is_read: false })]);
      render(<NotificationContentPage />);
      expect(screen.getByTestId("mark-all-button")).toBeDefined();
    });

    it("hides mark all button when all notifications are read", () => {
      mockNotifications([makeNotif({ is_read: true })]);
      render(<NotificationContentPage />);
      expect(screen.queryByTestId("mark-all-button")).toBeNull();
    });

    it("hides mark all button when there are no notifications", () => {
      mockNotifications([]);
      render(<NotificationContentPage />);
      expect(screen.queryByTestId("mark-all-button")).toBeNull();
    });

    it("calls markNotificationAsRead with all unread ids on click", async () => {
      mockMarkMutation.mockReturnValue({ unwrap: () => Promise.resolve() });
      mockNotifications([
        makeNotif({ id: "1", is_read: false }),
        makeNotif({ id: "2", is_read: false }),
        makeNotif({ id: "3", is_read: true }),
      ]);
      render(<NotificationContentPage />);
      fireEvent.click(screen.getByTestId("mark-all-button"));
      await waitFor(() => {
        expect(mockMarkMutation).toHaveBeenCalledWith({
          data: { notification_ids: ["1", "2"] },
        });
      });
    });
  });

  // ── Clic sur une notification individuelle ───────────────────────────────

  describe("individual notification click (handleRead)", () => {
    it("calls markNotificationAsRead with the correct notification id", async () => {
      mockMarkMutation.mockReturnValue({ unwrap: () => Promise.resolve() });
      mockNotifications([makeNotif({ id: "7", message: "Click me" })]);
      render(<NotificationContentPage />);
      fireEvent.click(screen.getByText("Click me").closest("button")!);
      await waitFor(() => {
        expect(mockMarkMutation).toHaveBeenCalledWith({
          data: { notification_ids: ["7"] },
        });
      });
    });

    it("shows server_error toast on 500+ error", async () => {
      mockMarkMutation.mockImplementation(() => ({
        unwrap: () => Promise.reject({ status: 500 }),
      }));
      mockNotifications([makeNotif({ id: "1", message: "Click me" })]);
      render(<NotificationContentPage />);
      fireEvent.click(screen.getByText("Click me").closest("button")!);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("server_error");
      });
    });

    it("shows an_error_occurred toast on non-500 error", async () => {
      mockMarkMutation.mockImplementation(() => ({
        unwrap: () => Promise.reject({ status: 400 }),
      }));
      mockNotifications([makeNotif({ id: "1", message: "Click me" })]);
      render(<NotificationContentPage />);
      fireEvent.click(screen.getByText("Click me").closest("button")!);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("an_error_occurred");
      });
    });
  });

  // ── Gestion des erreurs markAsRead ───────────────────────────────────────

  describe("markAsRead error handling", () => {
    it("shows server_error toast on 500+ error when marking all as read", async () => {
      mockMarkMutation.mockImplementation(() => Promise.reject({ status: 503 }));
      mockNotifications([makeNotif({ id: "1", is_read: false })]);
      render(<NotificationContentPage />);
      fireEvent.click(screen.getByTestId("mark-all-button"));
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("server_error");
      });
    });

    it("shows 400 field errors when marking all as read fails with 400", async () => {
      mockMarkMutation.mockImplementation(() =>
        Promise.reject({ status: 400, data: { name: ["Field error msg"] } }),
      );
      mockNotifications([makeNotif({ id: "1", is_read: false })]);
      render(<NotificationContentPage />);
      fireEvent.click(screen.getByTestId("mark-all-button"));
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("Field error msg");
      });
    });
  });
});
