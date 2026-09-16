"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/hooks/redux-toolkit";
import usePermission from "@/hooks/use-permissions";
import {
  CollapsibleMenuItem,
  MenuItem,
  SidebarMenuProps,
} from "@/types/sidebar.types";
import {
  BarChart3,
  Calendar,
  Home,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { PermissionInterface } from "@/types/permission.type";

export function SidebarMenu({
  menuItems,
  collapsibleItems,
  title = "MENUS",
  isCollapsed = false,
}: SidebarMenuProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const user = useAppSelector((state) => state.auth.user);
  const pathname: string = usePathname() || "";

  const allPermissions: PermissionInterface[] = user.groups.reduce<PermissionInterface[]>(
    (acc, g) => acc.concat(Array.isArray(g.permissions) ? g.permissions : []),
    []
  );

  const { hasPermission } = usePermission(allPermissions);

  const canSee = (permission?: string[]) => {
    if (user.is_superuser || user.is_staff) return true;
    if (!permission || permission.length === 0) return true;
    return permission.some((p) => hasPermission(p as any));
  };

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenItems((prev) => ({ ...prev, [id]: open }));
  };

  const subLinkClass = (href: string) =>
    `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
      pathname.includes(href)
        ? "bg-primary/10 text-primary font-medium"
        : "text-foreground hover:bg-muted"
    }`;

  return (
    <div className="flex-1 p-2">
      {!isCollapsed && (
        <div className="text-xs font-semibold text-muted-foreground mb-3 tracking-wide uppercase px-2">
          {title}
        </div>
      )}

      <nav className="space-y-1">
        {/* ── Simple menu items ── */}
        {menuItems?.map((item, index) => {
          if (!canSee(item.permission)) return null;

          if (isCollapsed) {
            return (
              <Tooltip key={item.id || `menu-${index}`} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <SidebarMenuItem {...item} isCollapsed={true} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <SidebarMenuItem key={item.id || `menu-${index}`} {...item} />;
        })}

        {menuItems && menuItems.length > 0 && collapsibleItems && collapsibleItems.length > 0 && (
          <Separator className="my-2" />
        )}

        {/* ── Collapsible menu items ── */}
        {collapsibleItems?.map((item) => {
          if (!canSee(item.permission)) return null;

          /* ── Collapsed mode: icon + HoverCard popup ── */
          if (isCollapsed) {
            return (
              <HoverCard key={item.id} openDelay={0} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div>
                    <SidebarMenuItem
                      icon={item.icon}
                      label={item.label}
                      isActive={item.isActive}
                      isCollapsed={true}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  side="right"
                  sideOffset={8}
                  align="start"
                  className="p-0 w-52 shadow-lg"
                >
                  <div className="px-3 py-2 text-xs font-semibold border-b border-border text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="py-1">
                    {item.subItems.map((subItem) => {
                      if (!canSee(subItem.permission)) return null;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={subLinkClass(subItem.href)}
                        >
                          {subItem.icon ? (
                            <subItem.icon
                              size={14}
                              className={`shrink-0 ${pathname.includes(subItem.href) ? "text-primary" : "text-muted-foreground/60"}`}
                            />
                          ) : (
                            <div
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                pathname.includes(subItem.href)
                                  ? "bg-primary"
                                  : "bg-muted-foreground/40"
                              }`}
                            />
                          )}
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          }

          /* ── Expanded mode: collapsible as before ── */
          return (
            <Collapsible
              key={item.id}
              open={openItems[item.id]}
              onOpenChange={(open) => handleOpenChange(item.id, open)}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuItem
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={item.isActive}
                  hasChevron={true}
                  isButton={true}
                  isOpen={openItems[item.id]}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="ml-9 pl-3 border-l border-border space-y-1 py-1">
                  {item.subItems.map((subItem) => {
                    if (!canSee(item.permission)) return null;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                          pathname.includes(subItem.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {subItem.icon ? (
                          <subItem.icon
                            size={14}
                            className={`shrink-0 ${pathname.includes(subItem.href) ? "text-primary" : "text-muted-foreground/60"}`}
                          />
                        ) : (
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              pathname.includes(subItem.href) ? "bg-primary" : "bg-muted-foreground/40"
                            }`}
                          />
                        )}
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </div>
  );
}

export const defaultMenuItems: MenuItem[] = [
  { id: "dashboard", icon: Home, label: "Tableau de bord", href: "/dashboard" },
  { id: "indices", icon: BarChart3, label: "Indices", href: "/indices", isActive: true },
  { id: "calendar", icon: Calendar, label: "Calendrier de campagne", href: "/calendar" },
  { id: "indicators", icon: TrendingUp, label: "Indicateurs", href: "/indicators" },
];

export const defaultCollapsibleItems: CollapsibleMenuItem[] = [
  {
    id: "administration",
    icon: Users,
    label: "Gestion de l'administration",
    subItems: [
      { label: "Utilisateurs", href: "/admin/users", isActive: false },
      { label: "Rôles", href: "/admin/roles", isActive: false },
      { label: "Permissions", href: "/admin/permissions", isActive: false },
    ],
  },
  {
    id: "settings",
    icon: Settings,
    label: "Paramétrages",
    subItems: [
      { label: "Général", href: "/settings/general", isActive: false },
      { label: "Notifications", href: "/settings/notifications", isActive: true },
      { label: "API", href: "/settings/api", isActive: false },
    ],
  },
];
