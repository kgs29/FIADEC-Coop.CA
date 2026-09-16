"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetRolesQuery } from "@/store/apis/auth/authentication.api";
import { RoleInterface } from "@/types/rule.type";
import { Archive, Shield } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_active_archived", label: "Actifs / Archivés" },
  { id: "bar_permissions",     label: "Permissions par rôle", colorIndex: 0 },
];

interface Props {
  readonly filterQuery?: string;
}

export default function RolesStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("roles", CHARTS.map((c) => c.id));
  const { data: activeData, isFetching } = useGetRolesQuery(buildStatsQuery(filterQuery));
  const { data: archivedData } = useGetRolesQuery(buildStatsQuery(filterQuery + "&archived=true"));

  const stats = useMemo(() => {
    const roles: RoleInterface[] = activeData?.results ?? [];
    const total    = activeData?.count ?? 0;
    const archived = archivedData?.count ?? 0;
    const active   = Math.max(0, total - archived);

    const permCounts = roles
      .map((r) => ({
        name: r.name,
        permissions: Array.isArray(r.groups) ? r.groups.length : 0,
      }))
      .sort((a, b) => b.permissions - a.permissions)
      .slice(0, 10);

    return { total, archived, active, permCounts };
  }, [activeData, archivedData]);

  if (isFetching && !(activeData?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="roles" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Shield className="w-5 h-5" />} color="bg-violet-50 dark:bg-violet-950/40 text-violet-600" />
        <StatCard label={t("active") ?? "Actifs"} value={stats.active} icon={<Shield className="w-5 h-5" />} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" />
        <StatCard label={t("archived") ?? "Archivés"} value={stats.archived} icon={<Archive className="w-5 h-5" />} color="bg-gray-50 dark:bg-gray-800/40 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_active_archived") && (
          <SimplePie
            title={t("stat_active_archived") ?? "Actifs / Archivés"}
            data={[
              { name: t("active") ?? "Actifs", value: stats.active },
              { name: t("archived") ?? "Archivés", value: stats.archived },
            ]}
            module="roles"
            chartId="pie_active_archived"
          />
        )}

        {isVisible("bar_permissions") && stats.permCounts.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_permissions_per_role") ?? "Permissions par rôle (top 10)"}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.permCounts} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={120} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, t("permissions") ?? "Permissions"]} />
                <Bar dataKey="permissions" fill={getChartColor("bar_permissions", 0)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
