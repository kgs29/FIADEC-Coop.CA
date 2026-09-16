import { LucideIcon } from "lucide-react";
import { PermissionKey } from "./permission.type";

export interface MenuItem {
  id?: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  permission? : PermissionKey[]
}

export interface CollapsibleMenuItem extends MenuItem {
  id: string;
  subItems: Array<{
    label: string;
    href: string;
    isActive?: boolean;
    permission?: PermissionKey[];
    icon?: LucideIcon;
  }>;
}


export interface SidebarMenuProps {
  readonly menuItems?: MenuItem[];
  readonly collapsibleItems?: CollapsibleMenuItem[];
  readonly title?: string;
  readonly isCollapsed?: boolean;
}
