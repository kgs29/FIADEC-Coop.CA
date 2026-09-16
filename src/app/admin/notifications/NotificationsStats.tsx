"use client";
import { SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetUserNotificationsQuery } from "@/store/apis/core/notification.api";
import { NotificationInterface } from "@/types/notification.types";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_read_unread", label: "Lues / Non lues" },
  { id: "bar_months",      label: "Notifications par mois", colorIndex: 0 },
];

interface Props { readonly filterQuery?: string }

export default function NotificationsStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("notifications", CHARTS.map((c) => c.id));
  const params = new URLSearchParams(filterQuery || "");
  params.delete("page");
  params.set("size", "500");
  params.append("page", "0");
  const { data, isFetching } = useGetUserNotificationsQuery(`?${params}`);
  const stats = useMemo(() => {
    const notifications: NotificationInterface[] = data?.results ?? [];
    const total = data?.count ?? notifications.length;
    const read = notifications.filter((n) => n.is_read).length;
    const unread = notifications.length - read;

    const byMonth: Record<string, number> = {};
    notifications.forEach((n) => {
      const month = new Date(n.created_at).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      byMonth[month] = (byMonth[month] ?? 0) + 1;
    });
    const byMonthData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));

    return { total, read, unread, byMonthData };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="notifications" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Bell className="w-5 h-5" />} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" />
        <StatCard label={t("stat_read") ?? "Lues"} value={stats.read} icon={<CheckCheck className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label={t("stat_unread") ?? "Non lues"} value={stats.unread} icon={<BellOff className="w-5 h-5" />} color="bg-orange-50 dark:bg-orange-950/40 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_read_unread") && (
          <SimplePie
            title={t("stat_read_unread") ?? "Lues / Non lues"}
            data={[
              { name: t("stat_read") ?? "Lues", value: stats.read },
              { name: t("stat_unread") ?? "Non lues", value: stats.unread },
            ]}
            module="notifications"
            chartId="pie_read_unread"
          />
        )}

        {isVisible("bar_months") && stats.byMonthData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_notifications_by_month") ?? "Notifications par mois (6 derniers mois)"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={TICK_STYLE} stroke="var(--muted-foreground)" />
                <YAxis tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" fill={getChartColor("bar_months", 0)} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
