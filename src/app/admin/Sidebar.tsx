"use client";
import { SidebarLogo } from "@/components/dashboard/sidebar/SidebarLogo";
import { SidebarMenu } from "@/components/dashboard/sidebar/SidebarMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Bell,
  Cpu,
  CreditCard,
  Database,
  FileText,
  GitMerge,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Monitor,
  ScrollText,
  Settings,
  Shield,
  SlidersHorizontal,
  Tag,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PermissionKey } from "@/types/permission.type";

// Permission strings reused across several menu entries below.
const PERM_VIEW_USER: PermissionKey[] = ["view_user"];
const PERM_ADD_LOGENTRY: PermissionKey[] = ["add_logentry"];

export function Sidebar() {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const pathname: string = usePathname() ?? "";
  const isCollapsed = useIsMobile();

  return (
    <aside
      className={cn(
        "bg-background border-r border-border flex flex-col h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <SidebarLogo isCollapsed={isCollapsed} />

        <ScrollArea className="flex-1">
          <SidebarMenu
            isCollapsed={isCollapsed}
            collapsibleItems={[
              {
                id: "item-administration",
                isActive: pathname.includes("/admin/administration/"),
                subItems: [
                  {
                    label: t("Dashboard.sidebar.users"),
                    href: "/admin/administration/users",
                    permission: PERM_VIEW_USER,
                    icon: Users,
                  },
                  {
                    label: t("Dashboard.sidebar.roles"),
                    href: "/admin/administration/roles",
                    permission: ["view_group"],
                    icon: Shield,
                  },
                  {
                    label: t("Dashboard.sidebar.groups"),
                    href: "/admin/administration/rules",
                    permission: ["view_group"],
                    icon: GitMerge,
                  },
                  {
                    label: t("Dashboard.sidebar.ad_group_mappings"),
                    href: "/admin/administration/ad-group-mappings",
                    permission: ["view_adgroupmapping"],
                    icon: Cpu,
                  },
                  {
                    label: t("Dashboard.sidebar.devices"),
                    href: "/admin/administration/devices",
                    permission: PERM_VIEW_USER,
                    icon: Monitor,
                  },
                  {
                    label: t("Dashboard.sidebar.logs"),
                    href: "/admin/administration/logs",
                    permission: ["view_activitylog"],
                    icon: ScrollText,
                  },
                  {
                    label: t("Dashboard.sidebar.notifications"),
                    href: "/admin/administration/notifications",
                    permission: ["view_notification"],
                    icon: Bell,
                  },
                  {
                    label: t("Dashboard.sidebar.newsletter"),
                    href: "/admin/administration/newsletter",
                    permission: PERM_VIEW_USER,
                    icon: Mail,
                  },
                  {
                    label: t("Dashboard.sidebar.contacts"),
                    href: "/admin/administration/contacts",
                    permission: PERM_VIEW_USER,
                    icon: MessageSquare,
                  },
                  {
                    label: t("Dashboard.sidebar.configuration"),
                    href: "/admin/administration/configuration",
                    permission: PERM_ADD_LOGENTRY,
                    icon: SlidersHorizontal,
                  },
                  {
                    label: t("Dashboard.sidebar.database"),
                    href: "/admin/administration/database",
                    permission: PERM_ADD_LOGENTRY,
                    icon: Database,
                  },
                ],
                icon: Settings,
                label: t("Dashboard.sidebar.administration"),
                permission: PERM_VIEW_USER,
              },
              {
                id: "item-projects",
                isActive: pathname.includes("/admin/projects"),
                subItems: [
                  {
                    label: t("Dashboard.sidebar.projects"),
                    href: "/admin/projects",
                    permission: ["view_project"],
                    icon: FileText,
                  },
                  {
                    label: t("Dashboard.sidebar.project_categories"),
                    href: "/admin/projects/categories",
                    permission: ["view_projectcategory"],
                    icon: Tag,
                  },
                ],
                icon: FileText,
                label: t("Dashboard.sidebar.projects"),
                permission: ["view_project"],
              },
              {
                id: "item-paiements",
                isActive: pathname.includes("/admin/paiements"),
                subItems: [
                  {
                    label: t("Dashboard.sidebar.all_payments"),
                    href: "/admin/paiements",
                    permission: PERM_ADD_LOGENTRY,
                    icon: CreditCard,
                  },
                ],
                icon: CreditCard,
                label: t("Dashboard.sidebar.payments"),
                permission: PERM_ADD_LOGENTRY,
              },
            ]}
            menuItems={[
              {
                label: t("Dashboard.sidebar.home"),
                icon: LayoutDashboard,
                isActive: pathname === "/admin",
                permission: PERM_ADD_LOGENTRY,
                href: "/admin",
              },
            ]}
          />
        </ScrollArea>

        <div className={cn("border-t border-border", isCollapsed ? "p-2" : "p-4")}>
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.username.toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">{t("User.role.admin")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
