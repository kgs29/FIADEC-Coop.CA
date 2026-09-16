import { BasePagination } from "./base";

export interface NotificationInterface {
  id: string;
  message: string;
  user: string;
  created_at: string;
  is_read: boolean;
  updated_at: string;
}

export interface NotifMarkInterface {
  notification_ids: string[];
}

export type NotificationInterfacePagination =
  BasePagination<NotificationInterface>;
