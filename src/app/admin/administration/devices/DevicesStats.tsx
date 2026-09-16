"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetDevicesQuery, UserDevice } from "@/store/apis/auth/authentication.api";
import { Laptop, WifiOff } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_session_status", label: "Statut des sessions" },
  { id: "pie_device_type",    label: "Type d'appareil" },
  { id: "bar_top_users",      label: "Top utilisateurs",  colorIndex: 2 },
  { id: "bar_activity",       label: "Activité récente",  colorIndex: 0 },
];

interface Props { readonly filterQuery?: string }

export default function DevicesStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("devices", CHARTS.map((c) => c.id));
  const { data, isFetching } = useGetDevicesQuery(buildStatsQuery(filterQuery));
  const stats = useMemo(() => {
    const devices: UserDevice[] = data?.results ?? [];
    const total       = data?.count ?? devices.length;
    const active      = devices.filter((d) => d.is_active).length;
    const disconnected = devices.filter((d) => !d.is_active).length;

    // Detect mobile vs desktop from user agent
    const mobileRe = /mobile|android|iphone|ipad|tablet/i;
    const mobile  = devices.filter((d) => mobileRe.test(d.user_agent)).length;
    const desktop = devices.length - mobile;

    // Top users by device count
    const userMap: Record<string, number> = {};
    devices.forEach((d) => { userMap[d.username] = (userMap[d.username] ?? 0) + 1; });
    const topUsers = Object.entries(userMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([username, count]) => ({ username, count }));

    // Activity per day (last 7 days)
    const dayMap: Record<string, number> = {};
    devices.forEach((d) => {
      const day = new Date(d.last_active).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
      dayMap[day] = (dayMap[day] ?? 0) + 1;
    });
    const recentDays = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([day, count]) => ({ day, count }));

    return { total, active, disconnected, mobile, desktop, topUsers, recentDays };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="devices" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Laptop className="w-5 h-5" />} color="bg-teal-50 dark:bg-teal-950/40 text-teal-600" />
        <StatCard label={t("stat_active_devices") ?? "Sessions actives"} value={stats.active} icon={<Laptop className="w-5 h-5" />} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" />
        <StatCard label={t("stat_disconnected") ?? "Déconnectés"} value={stats.disconnected} icon={<WifiOff className="w-5 h-5" />} color="bg-gray-50 dark:bg-gray-800/40 text-gray-500" />
        <StatCard label="Mobile / Desktop" value={`${stats.mobile} / ${stats.desktop}`} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isVisible("pie_session_status") && (
          <SimplePie
            title={t("stat_session_status") ?? "Statut des sessions"}
            data={[
              { name: t("stat_active_devices") ?? "Actives", value: stats.active },
              { name: t("stat_disconnected") ?? "Déconnectées", value: stats.disconnected },
            ]}
            module="devices"
            chartId="pie_session_status"
          />
        )}

        {isVisible("pie_device_type") && (
          <SimplePie
            title={t("stat_device_type") ?? "Type d'appareil"}
            data={[
              { name: "Mobile", value: stats.mobile },
              { name: "Desktop", value: stats.desktop },
            ]}
            module="devices"
            chartId="pie_device_type"
          />
        )}

        {isVisible("bar_top_users") && stats.topUsers.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 xl:col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_top_users_devices") ?? "Utilisateurs avec le plus d'appareils"}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.topUsers} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="username" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={110} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, t("Dashboard.sidebar.devices") ?? "Appareils"]} />
                <Bar dataKey="count" fill={getChartColor("bar_top_users", 2)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {isVisible("bar_activity") && stats.recentDays.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 xl:col-span-3">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_recent_activity") ?? "Activité récente (7 derniers jours)"}
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.recentDays} margin={{ right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={TICK_STYLE} stroke="var(--muted-foreground)" />
                <YAxis tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" name={t("stat_active_devices") ?? "Connexions"} fill={getChartColor("bar_activity", 0)} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
