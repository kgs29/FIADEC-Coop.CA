import { AuditAction, BasePagination } from "./base";
import { PermissionInterface } from "./permission.type";
import { RoleInterface, RuleInterface } from "./rule.type";

export type LoginPayload = {
  username: string;
  password: string;
  captcha_key?: string;
  captcha_answer?: string;
};

export interface LoginResponse {
  token: Token;
  msg: string;
  otp: boolean;
}

export interface LoginOTPResponse {
  requires_otp: true;
  otp_session: string;
  email: string;
}

export interface CaptchaResponse {
  captcha_key: string;
  captcha_question: string;
}

export interface Token {
  refresh: string;
  access: string;
  user: User;
}

export interface User {
  id: string;
  groups: RuleInterface[];
  user_permissions: PermissionInterface[];
  roles: RoleInterface[];
  last_login: null | Date;
  is_superuser: boolean;
  username: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  last_name: string;
  first_name: string;
  email: string;
  otp: string;
  phone_number: string;
  level: string;
  is_editor: boolean;
  two_factor_enabled: boolean;
  captcha_enabled: boolean;
  profile_photo?: string | null;
  structure_name?: string;
  history_datas?: AuditAction[];
}

export interface UserInterface {
  username: string;
  last_name: string;
  first_name: string;
  email: string;
  phone_number: string;
  role_ids: string[];
  roles?: RoleInterface[];
  two_factor_enabled?: boolean;
  captcha_enabled?: boolean;
  profile_photo?: File | string | null;
  password?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_editor?: boolean;
}
export interface Logout {
  refresh_token: string | null;
}

export type UsersPagination = BasePagination<User>;
