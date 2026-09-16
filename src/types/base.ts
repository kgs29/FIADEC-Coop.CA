export interface BaseInterface {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface BasePagination<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuditChange {
  field: string;
  old_value: string | null;
  new_value: string | null;
}

export interface AuditAction {
  action_date: string;
  user_id: string | null;
  reason: string | null;
  action_type: "create" | "update" | "delete";
  changes: AuditChange[];
}