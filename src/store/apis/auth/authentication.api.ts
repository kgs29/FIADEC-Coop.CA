import { BASE_API_URL } from "@/constants/env";
import {
  CaptchaResponse,
  LoginOTPResponse,
  LoginPayload,
  LoginResponse,
  Logout,
  User,
  UserInterface,
  UsersPagination,
} from "@/types/auth.types";
import { PermissionInterface } from "@/types/permission.type";
import {
  ADGroupMappingInterface,
  ADGroupMappingPagination,
  ADGroupMappingPayload,
  RoleInterface,
  RolePagination,
  RolePayload,
  RuleInterface,
  RuleInterfaces,
  RulePagination,
} from "@/types/rule.type";
import { ResetPasswordConfirmPayload } from "@/validators/auth.validators";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ActivityLogEntry {
  id: number;
  user: { id: number; username: string; email: string } | null;
  action: "create" | "update" | "delete";
  model_name: string;
  object_id: string;
  object_repr: string;
  changes: Record<string, [string, string]>;
  timestamp: string;
}

function withQuery(base: string, query?: string | void): string {
  return query ? `${base}?${query}` : base;
}

// Nom d'en-tête HTTP répété (auth par défaut + désactivation explicite sur les
// endpoints publics ci-dessous) : centralisé pour éviter la duplication du littéral.
const AUTHORIZATION_HEADER = "authorization";
const NO_AUTH_HEADERS = { [AUTHORIZATION_HEADER]: "" };

type Serializable = string | number | boolean | File | Serializable[];

function appendValue(fd: FormData, key: string, value: Serializable): void {
  if (value instanceof File) {
    fd.append(key, value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => appendValue(fd, key, v));
  } else {
    fd.append(key, String(value));
  }
}

function toFormData(data: object): FormData {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]: [string, unknown]) => {
    if (value === undefined || value === null) return;
    if (
      value instanceof File ||
      Array.isArray(value) ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      appendValue(fd, key, value as Serializable);
    }
  });
  return fd;
}

export interface UserDevice {
  id: number;
  user: number;
  username: string;
  ip_address: string | null;
  user_agent: string;
  created_at: string;
  last_active: string;
  disconnected_at: string | null;
  is_active: boolean;
}

export interface StatsConfig {
  module: string;
  config: Record<string, unknown>;
  updated_at?: string;
}

export const AuthenticationApi = createApi({
  reducerPath: "AuthenticationApi",
  tagTypes: ["Rules", "Users", "Roles", "ADGroupMappings", "UserDevices", "StatsConfig"],
  refetchOnFocus: false,
  keepUnusedDataFor: 60,
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}`,
    prepareHeaders: (headers, api) => {
      const raw = localStorage.getItem("access");
      if (raw && api.endpoint !== "login") {
        try {
          const parsed = JSON.parse(raw);
          headers.set(AUTHORIZATION_HEADER, `Bearer ${parsed}`);
        } catch {
          headers.set(AUTHORIZATION_HEADER, `Bearer ${raw}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse | LoginOTPResponse, LoginPayload>({
      query: (data) => ({
        url: `auth/login/`,
        method: "POST",
        body: data,
        headers: NO_AUTH_HEADERS,
      }),
    }),
    getCaptcha: builder.query<CaptchaResponse, void>({
      query: () => ({ url: "auth/captcha/", headers: NO_AUTH_HEADERS }),
    }),
    verifyOTP: builder.mutation<LoginResponse, { otp_session: string; otp_code: string }>({
      query: (data) => ({
        url: "auth/verify-otp/",
        method: "POST",
        body: data,
        headers: NO_AUTH_HEADERS,
      }),
    }),
    logout: builder.mutation<void, { data: Logout }>({
      query: ({ data }) => ({ url: "auth/logout/", method: "POST", body: data }),
    }),
    getUserProfile: builder.query<User, void>({
      query: () => "auth/get-user-profile/",
      providesTags: ["Users"],
    }),
    getSingleUser: builder.query<User, string>({
      query: (id) => `auth/users/${id}/`,
      providesTags: ["Users"],
    }),
    getUsers: builder.query<UsersPagination, string | void>({
      query: (query) => ({ url: withQuery("auth/users/", query) }),
      providesTags: ["Users"],
    }),
    getUsersForEditorCreate: builder.query<User[], string | void>({
      query: () => ({ url: `auth/users-editors/` }),
      providesTags: ["Users"],
    }),
    setUserStatus: builder.mutation<User, string>({
      query: (id) => ({ method: "POST", url: `auth/set-user-status/${id}/` }),
      invalidatesTags: ["Users"],
    }),
    createUser: builder.mutation<void, UserInterface>({
      query: (data) => ({ url: "auth/users/", method: "POST", body: toFormData(data) }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<UserInterface, { id: string; data: Partial<UserInterface> }>({
      query: ({ data, id }) => ({ url: `auth/users/${id}/`, method: "PUT", body: toFormData(data) }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `auth/users/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),

    // ── Groupes (anciens "Rules") ──────────────────────────────────────────────
    getRules: builder.query<RulePagination, void | string>({
      query: (query) => withQuery("auth/groups/", query),
      providesTags: ["Rules"],
    }),
    getSingleRule: builder.query<RuleInterface, string>({
      query: (id) => `auth/groups/${id}/`,
    }),
    createRule: builder.mutation<void, RuleInterfaces>({
      query: (data) => ({ url: "auth/groups/", method: "POST", body: data }),
      invalidatesTags: ["Rules"],
    }),
    updateRule: builder.mutation<void, { id: string; data: RuleInterfaces }>({
      query: ({ id, data }) => ({ url: `auth/groups/${id}/`, method: "PUT", body: data }),
      invalidatesTags: ["Rules"],
    }),
    deleteRule: builder.mutation<void, string>({
      query: (id) => ({ url: `auth/groups/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Rules"],
    }),

    // ── Rôles ─────────────────────────────────────────────────────────────────
    getRoles: builder.query<RolePagination, void | string>({
      query: (query) => withQuery("auth/roles/", query),
      providesTags: ["Roles"],
    }),
    getSingleRole: builder.query<RoleInterface, number | string>({
      query: (id) => `auth/roles/${id}/`,
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation<RoleInterface, RolePayload>({
      query: (data) => ({ url: "auth/roles/", method: "POST", body: data }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation<RoleInterface, { id: number | string; data: RolePayload }>({
      query: ({ id, data }) => ({ url: `auth/roles/${id}/`, method: "PUT", body: data }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation<void, number | string>({
      query: (id) => ({ url: `auth/roles/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Roles"],
    }),
    archiveRole: builder.mutation<RoleInterface, number | string>({
      query: (id) => ({ url: `auth/roles/${id}/archive/`, method: "POST" }),
      invalidatesTags: ["Roles"],
    }),
    unarchiveRole: builder.mutation<RoleInterface, number | string>({
      query: (id) => ({ url: `auth/roles/${id}/unarchive/`, method: "POST" }),
      invalidatesTags: ["Roles"],
    }),

    // ── AD Group Mappings ──────────────────────────────────────────────────────
    getADGroupMappings: builder.query<ADGroupMappingPagination, string | void>({
      query: (query) => withQuery("auth/ad-group-mappings/", query),
      providesTags: ["ADGroupMappings"],
    }),
    getSingleADGroupMapping: builder.query<ADGroupMappingInterface, number | string>({
      query: (id) => `auth/ad-group-mappings/${id}/`,
      providesTags: ["ADGroupMappings"],
    }),
    createADGroupMapping: builder.mutation<ADGroupMappingInterface, ADGroupMappingPayload>({
      query: (data) => ({ url: "auth/ad-group-mappings/", method: "POST", body: data }),
      invalidatesTags: ["ADGroupMappings"],
    }),
    updateADGroupMapping: builder.mutation<ADGroupMappingInterface, { id: number | string; data: ADGroupMappingPayload }>({
      query: ({ id, data }) => ({ url: `auth/ad-group-mappings/${id}/`, method: "PUT", body: data }),
      invalidatesTags: ["ADGroupMappings"],
    }),
    deleteADGroupMapping: builder.mutation<void, number | string>({
      query: (id) => ({ url: `auth/ad-group-mappings/${id}/`, method: "DELETE" }),
      invalidatesTags: ["ADGroupMappings"],
    }),
    archiveADGroupMapping: builder.mutation<ADGroupMappingInterface, number | string>({
      query: (id) => ({ url: `auth/ad-group-mappings/${id}/archive/`, method: "POST" }),
      invalidatesTags: ["ADGroupMappings"],
    }),
    unarchiveADGroupMapping: builder.mutation<ADGroupMappingInterface, number | string>({
      query: (id) => ({ url: `auth/ad-group-mappings/${id}/unarchive/`, method: "POST" }),
      invalidatesTags: ["ADGroupMappings"],
    }),

    // ── Permissions ────────────────────────────────────────────────────────────
    getPermissions: builder.query<PermissionInterface[], void>({
      query: () => "auth/permissions/",
    }),

    // ── Mot de passe ──────────────────────────────────────────────────────────
    resetPasswordGetToken: builder.mutation<unknown, { email: string }>({
      query: (email) => ({ url: `auth/reset_password_get_token/`, method: "POST", body: email }),
    }),
    resetPassword: builder.mutation<
      unknown,
      { uidb64: string; token: string; body: ResetPasswordConfirmPayload }
    >({
      query: ({ uidb64, token, body }) => ({
        url: `auth/reset_password_confirm/${uidb64}/${token}/`,
        method: "POST",
        body,
      }),
    }),
    // ── Duplicate ─────────────────────────────────────────────────────────────
    duplicateRole: builder.mutation<void, number | string>({
      query: (id) => ({ url: `auth/roles/${id}/duplicate/`, method: "POST" }),
      invalidatesTags: ["Roles"],
    }),
    duplicateRule: builder.mutation<void, number | string>({
      query: (id) => ({ url: `auth/groups/${id}/duplicate/`, method: "POST" }),
      invalidatesTags: ["Rules"],
    }),
    duplicateADGroupMapping: builder.mutation<void, number | string>({
      query: (id) => ({ url: `auth/ad-group-mappings/${id}/duplicate/`, method: "POST" }),
      invalidatesTags: ["ADGroupMappings"],
    }),

    // ── Réinitialisation mot de passe par défaut ──────────────────────────────
    resetDefaultPassword: builder.mutation<void, string>({
      query: (id) => ({ url: `auth/users/${id}/reset-default-password/`, method: "POST" }),
      invalidatesTags: ["Users"],
    }),

    // ── Activity Logs ─────────────────────────────────────────────────────────
    getItemActivityLog: builder.query<{ count: number; results: ActivityLogEntry[] }, { modelName: string; objectId: string | number }>({
      query: ({ modelName, objectId }) => `auth/activity-logs/?model_name=${modelName}&object_id=${objectId}&size=50`,
    }),

    // ── Appareils connectés ───────────────────────────────────────────────────
    getDevices: builder.query<{ count: number; results: UserDevice[] }, string | void>({
      query: (query) => ({ url: withQuery("auth/devices/", query) }),
      providesTags: ["UserDevices"],
    }),
    revokeDevice: builder.mutation<void, number>({
      query: (id) => ({ url: `auth/devices/${id}/`, method: "DELETE" }),
      invalidatesTags: ["UserDevices"],
    }),

    changePassword: builder.mutation<
      unknown,
      { body: { confirm_password: string; old_password: string; new_password: string } }
    >({
      query: ({ body }) => ({ url: `auth/change-password/`, method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    updateProfile: builder.mutation<
      unknown,
      { body: { first_name: string; last_name: string; email: string; phone_number: string } }
    >({
      query: ({ body }) => ({ url: `auth/update-profile/`, method: "PUT", body }),
      invalidatesTags: ["Users"],
    }),
    // Stats Configuration
    getStatsConfig: builder.query<StatsConfig, string>({
      query: (module) => `auth/stats-config/${module}/`,
      providesTags: (_result, _error, module) => [{ type: "StatsConfig", id: module }],
    }),
    updateStatsConfig: builder.mutation<StatsConfig, { module: string; config: Record<string, unknown> }>({
      query: ({ module, config }) => ({
        url: `auth/stats-config/${module}/`,
        method: "PUT",
        body: { config },
      }),
      invalidatesTags: (_result, _error, { module }) => [{ type: "StatsConfig", id: module }],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCaptchaQuery,
  useLazyGetCaptchaQuery,
  useVerifyOTPMutation,
  useLogoutMutation,
  useLazyGetUserProfileQuery,
  useGetUserProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetSingleUserQuery,
  useSetUserStatusMutation,
  useDeleteUserMutation,
  useResetPasswordGetTokenMutation,
  useResetPasswordMutation,
  // Groupes
  useGetRulesQuery,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useGetSingleRuleQuery,
  useCreateRuleMutation,
  // Rôles
  useGetRolesQuery,
  useGetSingleRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  // Permissions
  useGetPermissionsQuery,
  useGetUsersForEditorCreateQuery,
  // AD Group Mappings
  useGetADGroupMappingsQuery,
  useGetSingleADGroupMappingQuery,
  useCreateADGroupMappingMutation,
  useUpdateADGroupMappingMutation,
  useDeleteADGroupMappingMutation,
  useArchiveADGroupMappingMutation,
  useUnarchiveADGroupMappingMutation,
  // Roles (archive)
  useArchiveRoleMutation,
  useUnarchiveRoleMutation,
  useGetItemActivityLogQuery,
  useDuplicateRoleMutation,
  useDuplicateRuleMutation,
  useDuplicateADGroupMappingMutation,
  useResetDefaultPasswordMutation,
  useGetDevicesQuery,
  useRevokeDeviceMutation,
  // Stats Configuration
  useGetStatsConfigQuery,
  useUpdateStatsConfigMutation,
} = AuthenticationApi;
