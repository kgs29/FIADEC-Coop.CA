import { describe, it, expect } from "vitest";
import { 
  LoginPayload, 
  LoginResponse, 
  Token, 
  User, 
  UserInterface, 
  Logout, 
  UsersPagination 
} from "./auth.types";

// Mock dependencies for testing
interface MockBasePagination<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Mock interfaces that match the real interfaces structure
interface MockPermissionInterface {
  id: string;
  name: string;
  codename: string;
  created_at: string;
  updated_at: string;
}

interface MockRuleInterface {
  id: string;
  name: string;
  permissions: MockPermissionInterface[];
  created_at: string;
  updated_at: string;
}

interface MockAuditAction {
  id: string;
  action: string;
  timestamp: string;
  user_id: string;
  action_date: string;
  reason: string;
  action_type: "create" | "update" | "delete";
  changes: any;
}

describe("Auth Types", () => {
  describe("LoginPayload", () => {
    it("should accept valid login credentials", () => {
      const payload: LoginPayload = {
        username: "testuser",
        password: "password123",
      };

      expect(payload.username).toBe("testuser");
      expect(payload.password).toBe("password123");
    });

    it("should handle different username formats", () => {
      const payloads: LoginPayload[] = [
        { username: "user", password: "pass" },
        { username: "user@domain.com", password: "complexPass123!" },
        { username: "12345", password: "numericPass" },
        { username: "user_with_underscore", password: "pass_with_underscore" },
      ];

      payloads.forEach((payload) => {
        expect(typeof payload.username).toBe("string");
        expect(typeof payload.password).toBe("string");
        expect(payload.username.length).toBeGreaterThan(0);
        expect(payload.password.length).toBeGreaterThan(0);
      });
    });
  });

  describe("LoginResponse", () => {
    it("should accept valid login response", () => {
      const mockUser: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: new Date(),
        is_superuser: false,
        username: "testuser",
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "123456",
        phone_number: "+1234567890",
        level: "user",
        is_editor: false,
      };

      const token: Token = {
        refresh: "refresh-token",
        access: "access-token",
        user: mockUser,
      };

      const response: LoginResponse = {
        token,
        msg: "Login successful",
        otp: false,
      };

      expect(response.token).toBe(token);
      expect(response.msg).toBe("Login successful");
      expect(response.otp).toBe(false);
    });

    it("should handle OTP required response", () => {
      const response: LoginResponse = {
        token: {} as Token,
        msg: "OTP required",
        otp: true,
      };

      expect(response.otp).toBe(true);
      expect(response.msg).toBe("OTP required");
    });
  });

  describe("Token", () => {
    it("should accept valid token structure", () => {
      const mockUser: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: null,
        is_superuser: false,
        username: "testuser",
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "123456",
        phone_number: "+1234567890",
        level: "user",
        is_editor: false,
      };

      const token: Token = {
        refresh: "refresh-token-string",
        access: "access-token-string",
        user: mockUser,
      };

      expect(typeof token.refresh).toBe("string");
      expect(typeof token.access).toBe("string");
      expect(token.user).toBeDefined();
      expect(token.user.username).toBe("testuser");
    });
  });

  describe("User", () => {
    it("should accept complete user data", () => {
      const mockPermissions: MockPermissionInterface[] = [
        { id: "1", name: "Can view", codename: "can_view", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
        { id: "2", name: "Can edit", codename: "can_edit", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
      ];

      const mockRules: MockRuleInterface[] = [
        { id: "1", name: "Admin", permissions: mockPermissions, created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
      ];

      const mockAuditActions: MockAuditAction[] = [
        { 
          id: "1", 
          action: "login", 
          timestamp: "2023-01-01T00:00:00Z", 
          user_id: "1",
          action_date: "2023-01-01T00:00:00Z",
          reason: "User login",
          action_type: "create",
          changes: null
        },
      ];

      const user: User = {
        id: "1",
        groups: mockRules,
        user_permissions: mockPermissions,
        last_login: new Date("2023-01-01T00:00:00Z"),
        is_superuser: false,
        username: "testuser",
        is_staff: false,
        is_active: true,
        date_joined: new Date("2022-01-01T00:00:00Z"),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "123456",
        phone_number: "+1234567890",
        level: "admin",
        is_editor: true,
        structure_name: "Test Structure",
        history_datas: mockAuditActions,
      };

      expect(user.id).toBe("1");
      expect(user.username).toBe("testuser");
      expect(user.is_superuser).toBe(false);
      expect(user.is_staff).toBe(false);
      expect(user.is_active).toBe(true);
      expect(user.is_editor).toBe(true);
      expect(user.last_login).toBeInstanceOf(Date);
      expect(user.date_joined).toBeInstanceOf(Date);
      expect(user.first_name).toBeNull();
      expect(user.email).toBe("test@example.com");
      expect(user.phone_number).toBe("+1234567890");
      expect(user.level).toBe("admin");
      expect(user.structure_name).toBe("Test Structure");
      expect(user.history_datas).toHaveLength(1);
    });

    it("should handle user with null last_login", () => {
      const user: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: null,
        is_superuser: false,
        username: "testuser",
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "",
        phone_number: "",
        level: "user",
        is_editor: false,
      };

      expect(user.last_login).toBeNull();
    });

    it("should handle user without optional fields", () => {
      const user: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: null,
        is_superuser: false,
        username: "testuser",
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "",
        phone_number: "",
        level: "user",
        is_editor: false,
      };

      expect(user.structure_name).toBeUndefined();
      expect(user.history_datas).toBeUndefined();
    });

    it("should validate boolean fields", () => {
      const users: User[] = [
        {
          id: "1",
          groups: [],
          user_permissions: [],
          last_login: null,
          is_superuser: true,
          username: "admin",
          is_staff: true,
          is_active: true,
          date_joined: new Date(),
          last_name: "Admin",
          first_name: null,
          email: "admin@example.com",
          otp: "",
          phone_number: "",
          level: "super",
          is_editor: true,
        },
        {
          id: "2",
          groups: [],
          user_permissions: [],
          last_login: null,
          is_superuser: false,
          username: "user",
          is_staff: false,
          is_active: false,
          date_joined: new Date(),
          last_name: "User",
          first_name: null,
          email: "user@example.com",
          otp: "",
          phone_number: "",
          level: "basic",
          is_editor: false,
        },
      ];

      expect(users[0].is_superuser).toBe(true);
      expect(users[0].is_staff).toBe(true);
      expect(users[0].is_active).toBe(true);
      expect(users[0].is_editor).toBe(true);

      expect(users[1].is_superuser).toBe(false);
      expect(users[1].is_staff).toBe(false);
      expect(users[1].is_active).toBe(false);
      expect(users[1].is_editor).toBe(false);
    });
  });

  describe("UserInterface", () => {
    it("should accept valid user interface data", () => {
      const mockRules: MockRuleInterface[] = [
        { id: "1", name: "User Group", permissions: [], created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T00:00:00Z" },
      ];

      const userInterface: UserInterface = {
        username: "testuser",
        last_name: "Doe",
        first_name: "John",
        email: "john.doe@example.com",
        phone_number: "+1234567890",
        is_editor: false,
        group_id: "1",
        groups: mockRules,
      };

      expect(userInterface.username).toBe("testuser");
      expect(userInterface.last_name).toBe("Doe");
      expect(userInterface.first_name).toBe("John");
      expect(userInterface.email).toBe("john.doe@example.com");
      expect(userInterface.phone_number).toBe("+1234567890");
      expect(userInterface.is_editor).toBe(false);
      expect(userInterface.group_id).toBe("1");
      expect(userInterface.groups).toHaveLength(1);
    });

    it("should handle user interface without optional groups", () => {
      const userInterface: UserInterface = {
        username: "testuser",
        last_name: "Doe",
        first_name: "John",
        email: "john.doe@example.com",
        phone_number: "+1234567890",
        is_editor: true,
        group_id: "2",
      };

      expect(userInterface.groups).toBeUndefined();
      expect(userInterface.is_editor).toBe(true);
    });

    it("should validate email format", () => {
      const userInterfaces: UserInterface[] = [
        {
          username: "user1",
          last_name: "Smith",
          first_name: "John",
          email: "john.smith@company.com",
          phone_number: "+1234567890",
          is_editor: false,
          group_id: "1",
        },
        {
          username: "user2",
          last_name: "Doe",
          first_name: "Jane",
          email: "jane.doe@sub.domain.org",
          phone_number: "+0987654321",
          is_editor: true,
          group_id: "2",
        },
      ];

      userInterfaces.forEach((user) => {
        expect(user.email).toContain("@");
        expect(user.email.split("@")).toHaveLength(2);
      });
    });
  });

  describe("Logout", () => {
    it("should accept logout with refresh token", () => {
      const logout: Logout = {
        refresh_token: "refresh-token-string",
      };

      expect(logout.refresh_token).toBe("refresh-token-string");
    });

    it("should accept logout with null refresh token", () => {
      const logout: Logout = {
        refresh_token: null,
      };

      expect(logout.refresh_token).toBeNull();
    });
  });

  describe("UsersPagination", () => {
    it("should accept valid pagination data", () => {
      const mockUsers: User[] = [
        {
          id: "1",
          groups: [],
          user_permissions: [],
          last_login: null,
          is_superuser: false,
          username: "user1",
          is_staff: false,
          is_active: true,
          date_joined: new Date(),
          last_name: "User",
          first_name: null,
          email: "user1@example.com",
          otp: "",
          phone_number: "",
          level: "user",
          is_editor: false,
        },
        {
          id: "2",
          groups: [],
          user_permissions: [],
          last_login: null,
          is_superuser: false,
          username: "user2",
          is_staff: false,
          is_active: true,
          date_joined: new Date(),
          last_name: "User",
          first_name: null,
          email: "user2@example.com",
          otp: "",
          phone_number: "",
          level: "user",
          is_editor: false,
        },
      ];

      const pagination: MockBasePagination<User> = {
        count: 2,
        next: null,
        previous: null,
        results: mockUsers,
      };

      expect(pagination.count).toBe(2);
      expect(pagination.results).toHaveLength(2);
      expect(pagination.results[0].username).toBe("user1");
      expect(pagination.results[1].username).toBe("user2");
    });

    it("should handle empty pagination", () => {
      const pagination: MockBasePagination<User> = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      expect(pagination.count).toBe(0);
      expect(pagination.results).toHaveLength(0);
    });

    it("should handle pagination with navigation links", () => {
      const mockUser: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: null,
        is_superuser: false,
        username: "user",
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "User",
        first_name: null,
        email: "user@example.com",
        otp: "",
        phone_number: "",
        level: "user",
        is_editor: false,
      };

      const pagination: MockBasePagination<User> = {
        count: 10,
        next: "https://api.example.com/users?page=2",
        previous: "https://api.example.com/users?page=1",
        results: [mockUser],
      };

      expect(pagination.next).toBe("https://api.example.com/users?page=2");
      expect(pagination.previous).toBe("https://api.example.com/users?page=1");
      expect(pagination.results).toHaveLength(1);
    });
  });

  describe("Type Compatibility and Integration", () => {
    it("should ensure User and UserInterface compatibility", () => {
      const user: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: null,
        is_superuser: false,
        username: "testuser",
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "",
        phone_number: "+1234567890",
        level: "user",
        is_editor: false,
      };

      const userInterface: UserInterface = {
        username: user.username,
        last_name: user.last_name,
        first_name: user.first_name || "",
        email: user.email,
        phone_number: user.phone_number,
        is_editor: user.is_editor,
        group_id: "1",
      };

      expect(userInterface.username).toBe(user.username);
      expect(userInterface.email).toBe(user.email);
      expect(userInterface.is_editor).toBe(user.is_editor);
    });

    it("should handle complete authentication flow types", () => {
      const loginPayload: LoginPayload = {
        username: "testuser",
        password: "password123",
      };

      const mockUser: User = {
        id: "1",
        groups: [],
        user_permissions: [],
        last_login: new Date(),
        is_superuser: false,
        username: loginPayload.username,
        is_staff: false,
        is_active: true,
        date_joined: new Date(),
        last_name: "Doe",
        first_name: null,
        email: "test@example.com",
        otp: "123456",
        phone_number: "+1234567890",
        level: "user",
        is_editor: false,
      };

      const token: Token = {
        refresh: "refresh-token",
        access: "access-token",
        user: mockUser,
      };

      const loginResponse: LoginResponse = {
        token,
        msg: "Login successful",
        otp: false,
      };

      const logout: Logout = {
        refresh_token: token.refresh,
      };

      expect(loginPayload.username).toBe(loginResponse.token.user.username);
      expect(logout.refresh_token).toBe(token.refresh);
      expect(loginResponse.otp).toBe(false);
    });
  });
});
