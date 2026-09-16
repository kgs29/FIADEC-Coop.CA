import { PermissionInterface } from "./permission.type";

export interface RuleInterface {
  id: string | number;
  name: string;
  permissions?: PermissionInterface[];
}

export interface RuleInterfaces {
  name: string;
  permissions: (string | number)[];
}

export interface RulePagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: RuleInterface[];
}

// Role = agrège plusieurs groupes, attribuable à des utilisateurs
export interface RoleInterface {
  id: number;
  name: string;
  groups: RuleInterface[];
  users_count: number;
  is_archived: boolean;
}

export interface RolePayload {
  name: string;
  group_ids: number[];
}

export interface RolePagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: RoleInterface[];
}

export interface ADGroupMappingInterface {
  id: number;
  ad_group_name: string;
  role: number;
  role_name: string;
  is_archived: boolean;
}

export interface ADGroupMappingPayload {
  ad_group_name: string;
  role: number;
}

export interface ADGroupMappingPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: ADGroupMappingInterface[];
}
