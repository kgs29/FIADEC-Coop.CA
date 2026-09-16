"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAppSelector } from "@/hooks/redux-toolkit";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarMenu } from "./SidebarMenu";

const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://127.0.0.1:8000/v1/").replace(/\/v1\/?$/, "");

function buildAvatarSrc(photo?: string | null): string | undefined {
  if (!photo) return undefined;
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("/")) return `${BACKEND_ORIGIN}${photo}`;
  return `${BACKEND_ORIGIN}/media/${photo}`;
}

interface SidebarProps {
  isMobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({ isMobile = false, open, onOpenChange }: Readonly<SidebarProps>) {
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  const avatarSrc = buildAvatarSrc(user.profile_photo);

  const sidebarContent = (
    <>
      <SidebarLogo />
      <ScrollArea className="flex-1">
        <SidebarMenu />
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full object-cover ring-2 ring-primary/30"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.username.toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.is_editor ? t("User.role.editor") : t("User.role.admin")}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-72 bg-card border-r border-border">
          <div className="h-full flex flex-col">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="h-full flex flex-col">{sidebarContent}</div>
    </aside>
  );
}
