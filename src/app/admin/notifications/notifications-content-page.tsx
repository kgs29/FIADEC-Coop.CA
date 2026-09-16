"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PermissionGuard from "@/lib/PermissionGuard";
import {
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "@/store/apis/core/notification.api";

import { NotificationInterface } from "@/types/notification.types";
import { Bell, CheckCheck, Clock, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ELLIPSIS = "ellipsis" as const;

interface NotificationContentPageProps {
  onFiltersChange?: (filterQuery: string) => void;
  onCountUpdate?: (info: { total: number; unread: number } | null) => void;
}

const NotificationContentPage = ({ onFiltersChange: _onFiltersChange, onCountUpdate }: NotificationContentPageProps) => {
  const { t } = useTranslation();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data: notifications } = useGetUserNotificationsQuery(
    `?page=${pageIndex}&size=${pageSize}`,
  );

  const [unreadNotifications, setUnreadNotifications] = useState<
    NotificationInterface[] | undefined
  >([]);
  const [markNotificationAsRead, { isLoading }] =
    useMarkNotificationAsReadMutation();

  const totalPages = notifications?.count
    ? Math.ceil(notifications.count / pageSize)
    : 1;

  const handleNextPrev = (action: "next" | "prev") => {
    if (action === "next" && pageIndex < totalPages) {
      setPageIndex(pageIndex + 1);
    } else if (action === "prev" && pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | typeof ELLIPSIS)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= pageIndex - delta && i <= pageIndex + delta)
      ) {
        range.push(i);
      } else if (range.at(-1) !== ELLIPSIS) {
        range.push(ELLIPSIS);
      }
    }
    return range;
  };

  const paginationRange = getPaginationRange();

  const handleRead = async (notif: NotificationInterface) => {
    try {
      const notifs = [notif.id];
      const data = { notification_ids: notifs };
      await markNotificationAsRead({ data }).unwrap();
    } catch (e: any) {
      if (e?.status >= 500) {
        toast.error(t("server_error"));
      } else {
        toast.error(t("an_error_occurred"));
      }
    }
  };

  const markAsRead = async () => {
    try {
      const notifs = (unreadNotifications ?? []).map((e) => e.id);
      const data = { notification_ids: notifs };
      await markNotificationAsRead({ data });
    } catch (e: any) {
      if (e?.status === 400) {
        e?.data?.name.forEach((message: string) => toast.error(message));
        return;
      } else if (e?.status >= 500) {
        toast.error(t("server_error"));
        return;
      }
      toast.error(t("error_occurred"));
    }
  };

  useEffect(() => {
    const unread = notifications?.results.filter((n) => !n.is_read) ?? [];
    setUnreadNotifications(unread);
    onCountUpdate?.(notifications ? { total: notifications.count, unread: unread.length } : null);
  }, [notifications, onCountUpdate]);

  return (
    <div className="rounded-md bg-white m-4 p-6 px-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full flex flex-col gap-8">
          <TabsList className="bg-transparent flex gap-8 mb-4">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-transparent cursor-pointer data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Label className="text-lg flex items-center">
                {t("notificationUnreadList")} ({unreadNotifications?.length})
              </Label>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-transparent cursor-pointer data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Label className="text-lg flex items-center">
                {t("notificationList")}
              </Label>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {(unreadNotifications?.length ?? 0) > 0 && (
              <PermissionGuard permission="change_notification">
                <Button
                  onClick={markAsRead}
                  className="flex items-center gap-2"
                  aria-label={t("markAsRead")}
                >
                  {isLoading ? (
                    <Loader className="animate-spin " />
                  ) : (
                    <CheckCheck />
                  )}
                  <span className="text-sm">{t("markAsRead")}</span>
                </Button>
              </PermissionGuard>
            )}
            <div className="flex flex-col gap-3 w-full">
              {(unreadNotifications?.length ?? 0) > 0 ? (
                unreadNotifications?.map((notif) => (
                  <div key={notif.id} className="w-full">
                    <button
                      className="w-full"
                      aria-label={t("")}
                      onClick={() => handleRead(notif)}
                    >
                      <div className="flex gap-3 justify-start items-center hover:bg-gray-100 p-3 px-4">
                        <div className="relative flex ">
                          <div
                            className={`${
                              notif.is_read ? "bg-gray-200" : "bg-primary"
                            }  rounded-full p-2 text-white`}
                          >
                            <Bell className="size-4" />
                          </div>
                          {!notif.is_read && (
                            <span className="flex right-0 absolute bg-primary size-2 z-50 ring-1 ring-white rounded-full"></span>
                          )}
                        </div>

                        <div className="flex flex-col w-full gap-2">
                          <div className="flex self-end items-center text-secondary gap-1">
                            <Clock className="size-4" />
                            <span className="text-xs">
                              {new Date(notif.created_at).toLocaleDateString()}
                              {" - "}
                              {new Date(notif.created_at).toLocaleTimeString()}
                            </span>
                          </div>

                          <span className="text-base flex">
                            {notif.message}
                          </span>
                        </div>
                      </div>
                    </button>
                    <Separator />
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center w-full">
                  <Label className="flex-nowrap dark:text-white">
                    {t("no_unread_notifications")}
                  </Label>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              {notifications?.results.map((notif) => (
                <div key={notif.id} className="w-full">
                  <button aria-label={t("notif")} className="w-full" onClick={() => handleRead(notif)}>
                    <div className="flex gap-3 justify-start items-center hover:bg-gray-100 p-3 px-4">
                      <div className="relative flex ">
                        <div
                          className={`${
                            notif.is_read ? "bg-gray-200" : "bg-primary"
                          }  rounded-full p-2 text-white`}
                        >
                          <Bell className="size-4" />
                        </div>
                        {!notif.is_read && (
                          <span className="flex right-0 absolute bg-primary size-2 z-50 ring-1 ring-white rounded-full"></span>
                        )}
                      </div>

                      <div className="flex flex-col w-full gap-2">
                        <div className="flex self-end items-center text-secondary gap-1">
                          <Clock className="size-4" />
                          <span className="text-xs">
                            {new Date(notif.created_at).toLocaleDateString()}
                            {" - "}
                            {new Date(notif.created_at).toLocaleTimeString()}
                          </span>
                        </div>

                        <span className="text-base flex">{notif.message}</span>
                      </div>
                    </div>
                  </button>
                  <Separator />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4 w-full">
                <Label className="flex-nowrap dark:text-white">{t("rows_per_page")}</Label>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setPageIndex(0);
                  }}
                >
                  <SelectTrigger className="w-40" id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectGroup>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        pageIndex <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      onClick={() => handleNextPrev("prev")}
                    />
                  </PaginationItem>

                  {paginationRange.map((page, idx) => {
                    if (page === ELLIPSIS) {
                      return (
                        <PaginationItem
                          key={`ellipsis-${idx < totalPages / 2 ? "start" : "end"}`}
                        >
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={pageIndex + 1 === page}
                          onClick={() => setPageIndex((page as number) - 1)}
                          className={`${pageIndex + 1 === page ? "bg-secondary text-white dark:text-white pointer-events-none" : ""} cursor-pointer`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      className={
                        pageIndex === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      onClick={() => handleNextPrev("next")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationContentPage;
