"use client";
import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import NotificationContentPage from "@/app/admin/notifications/notifications-content-page";
import NotificationsStats from "@/app/admin/notifications/NotificationsStats";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const NotificationAdminPage = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<{ total: number; unread: number } | null>(null);

  return (
    <UrlGuard permission="view_notification">
      <StatsTabLayout
        statsPanel={<NotificationsStats />}
        aboveSearch={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">
              {t("Dashboard.sidebar.notifications") ?? "Notifications"}
            </h2>
            {info && (
              <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
                {info.unread > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {info.unread} {t("notificationUnread") ?? "non lues"}
                  </span>
                )}
                <span className="px-3 py-1 bg-muted rounded-full">
                  Total : <strong>{info.total}</strong>
                </span>
              </div>
            )}
          </div>
        }
      >
        <NotificationContentPage onCountUpdate={setInfo} />
      </StatsTabLayout>
    </UrlGuard>
  );
};

export default NotificationAdminPage;
