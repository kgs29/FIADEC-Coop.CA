"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/hooks/redux-toolkit";
import i18n from "@/locale/i18n";
import { useLogoutMutation } from "@/store/apis/auth/authentication.api";
import { useGetUserNotificationsQuery } from "@/store/apis/core/notification.api";
import { NotificationInterface } from "@/types/notification.types";
import {
  Bell,
  ChevronsUpDown,
  Loader2,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LangSwitcher } from "../custum/Header";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";

const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://127.0.0.1:8000/v1/").replace(/\/v1\/?$/, "");

function buildAvatarSrc(photo?: string | null): string | undefined {
  if (!photo) return undefined;
  if (photo.startsWith("http")) return photo;
  if (photo.startsWith("/")) return `${BACKEND_ORIGIN}${photo}`;
  return `${BACKEND_ORIGIN}/media/${photo}`;
}

export default function UserMenu() {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const [_logout, { isLoading }] = useLogoutMutation();
  const { data: notificationsList } = useGetUserNotificationsQuery();
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationInterface[] | undefined>([]);

  const handleLogout = async () => {
    try {
      const raw = localStorage.getItem("refresh");
      const refresh_token = raw ? JSON.parse(raw) : raw;
      if (refresh_token) {
        await _logout({ data: { refresh_token } }).unwrap();
      }
    } catch {
      // On continue même si l'appel API échoue
    } finally {
      localStorage.clear();
      globalThis.location.href = "/web";
    }
  };

  const changeLang = (lang: string) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
  };

  const displayName = user.username.toUpperCase();
  const avatarSrc = buildAvatarSrc(user.profile_photo);
  const fallbackInitials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const roleLabel = user.is_editor ? t("User.role.editor") : t("User.role.admin");

  useEffect(() => {
    setUnreadNotifications(notificationsList?.results.filter((n: NotificationInterface) => !n.is_read));
  }, [notificationsList]);

  return (
    <div className="flex items-center gap-2">
      {/* Notifications - lien direct vers la page */}
      <Link
        href={user.is_editor ? "/editors/notifications" : "/admin/notifications"}
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-banner hover:text-white transition-colors"
        title={t("notificationList")}
      >
        <Bell className="size-5" />
        <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
          {unreadNotifications?.length ?? 0}
        </span>
      </Link>

      <LangSwitcher currentLang={currentLang} onChange={changeLang} />

      {/* User Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-muted data-[state=open]:bg-muted"
          >
            <Avatar className="h-9 w-9 ring-2 ring-primary ring-offset-2">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="bg-banner text-white font-semibold text-sm">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground">{displayName}</span>
              <span className="text-xs text-muted-foreground">{roleLabel}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72 p-2">
          <div className="flex items-center gap-3 px-2 py-3 mb-1">
            <Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">{displayName}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              <Badge variant="secondary" className="w-fit mt-1 text-xs">{roleLabel}</Badge>
            </div>
          </div>

          <DropdownMenuSeparator />

          <Link
            href={user.is_editor ? "/editors/profile" : "/admin/profile"}
            className="text-sm font-medium"
          >
            <DropdownMenuItem asChild className="cursor-pointer">
              <div className="flex items-center gap-3 px-2 py-2 rounded-md">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  {t("User.menu.profile")}
                  <span className="text-xs text-muted-foreground">{t("User.menu.profile_desc")}</span>
                </div>
              </div>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setIsDialogOpen(true)}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
                <LogOut className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-sm font-medium">{t("User.menu.logout")}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>{t("logout")}</DialogTitle>
          <DialogDescription>{t("logoutText")}</DialogDescription>
          <div className="flex justify-center gap-x-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleLogout} variant="destructive">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("yes")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
