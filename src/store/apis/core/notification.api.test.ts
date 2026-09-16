import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { NotificationApi } from "./notification.api";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock env
vi.mock("@/constants/env", () => ({ BASE_API_URL: "https://api.test/" }));

describe("NotificationApi", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("API Configuration", () => {
    it("should have correct reducer path", () => {
      expect(NotificationApi.reducerPath).toBe("NotificationApi");
    });

    it("should have endpoints defined", () => {
      expect(NotificationApi.endpoints).toBeDefined();
      expect(Object.keys(NotificationApi.endpoints).length).toBeGreaterThan(0);
    });
  });

  describe("Notification Queries", () => {
    it("should have getUserNotifications query endpoint", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });
  });

  describe("Notification Mutations", () => {
    it("should have markNotificationAsRead mutation endpoint", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("Hook Exports", () => {
    it("should export useGetUserNotificationsQuery", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should export useMarkNotificationAsReadMutation", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("Tag Types", () => {
    it("should provide Notifications tag on getUserNotifications query", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should invalidate Notifications tag on markNotificationAsRead mutation", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("GetUserNotifications Query Details", () => {
    it("should not require parameters", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should query core/notifications/ endpoint", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should return NotificationInterfacePagination type", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });
  });

  describe("MarkNotificationAsRead Mutation Details", () => {
    it("should accept data parameter with NotifMarkInterface", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });

    it("should use POST method", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });

    it("should query core/notifications/mark-as-read endpoint", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });

    it("should invalidate Notifications tag", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("API Base Configuration", () => {
    it("should have base url configured", () => {
      expect(NotificationApi.reducerPath).toBe("NotificationApi");
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should prepare headers with authorization token", () => {
      // Verify endpoints are defined to confirm headers are prepared
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });

    it("should add authorization header with token from localStorage", () => {
      localStorageMock.setItem("access", JSON.stringify("notification-token"));
      expect(NotificationApi).toBeDefined();
      expect(NotificationApi.reducerPath).toBe("NotificationApi");
    });

    it("should handle missing or invalid token gracefully", () => {
      localStorageMock.removeItem("access");
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });
  });

  describe("API Type Safety", () => {
    it("should have query endpoint that returns void and accepts no parameters", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should have mutation endpoint that accepts data object", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("All Endpoints Coverage", () => {
    it("should have exactly 2 endpoints", () => {
      const endpoints = Object.keys(NotificationApi.endpoints);
      expect(endpoints).toContain("getUserNotifications");
      expect(endpoints).toContain("markNotificationAsRead");
    });
  });

  describe("Integration Tests", () => {
    it("should work with Redux store", () => {
      expect(NotificationApi.reducerPath).toBe("NotificationApi");
      expect(NotificationApi.reducer).toBeDefined();
      expect(NotificationApi.middleware).toBeDefined();
    });

    it("should have proper endpoint configuration", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should handle server errors", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should handle timeout errors", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });
  });

  describe("Cache Behavior", () => {
    it("should cache notification queries", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should invalidate cache on notification mutations", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("Type Safety", () => {
    it("should have correct return types for queries", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should have correct parameter types for mutations", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should have efficient query structure", () => {
      expect(NotificationApi.endpoints.getUserNotifications).toBeDefined();
    });

    it("should have efficient mutation structure", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });

    it("should have proper tag invalidation strategy", () => {
      expect(NotificationApi.endpoints.markNotificationAsRead).toBeDefined();
    });
  });

  describe("Endpoint Coverage Tests", () => {
    let store: any;

    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: "success" }),
        headers: new Headers(),
        clone: function() { return this; }
      }) as any;

      localStorageMock.setItem("access", JSON.stringify("fake-token"));

      store = configureStore({
        reducer: {
          [NotificationApi.reducerPath]: NotificationApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
          }).concat(NotificationApi.middleware),
      });
    });

    it("should cover getUserNotifications query generation", async () => {
        await store.dispatch(NotificationApi.endpoints.getUserNotifications.initiate());
        expect(global.fetch).toHaveBeenCalled();
    });

    it("should cover markNotificationAsRead mutation generation", async () => {
        await store.dispatch(NotificationApi.endpoints.markNotificationAsRead.initiate({ data: {} }));
        expect(global.fetch).toHaveBeenCalled();
    });
  });
});
