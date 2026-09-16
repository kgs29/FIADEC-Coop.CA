"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetADGroupMappingsQuery } from "@/store/apis/auth/authentication.api";
import { ADGroupMappingInterface } from "@/types/rule.type";
import { Link2, Archive } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_active_archived", label: "Actifs / Archivés" },
  { id: "bar_roles",           label: "Mappings par rôle", colorIndex: 2 },
];

interface Props { readonly filterQuery?: string }

export default function ADGroupMappingsStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("ad_group_mappings", CHARTS.map((c) => c.id));
  const activeQuery = buildStatsQuery(filterQuery) + "&archived=false";
  const archivedQuery = buildStatsQuery(filterQuery) + "&archived=true";
  const { data: dataActive, isFetching: fetchingActive } = useGetADGroupMappingsQuery(activeQuery);
  const { data: dataArchived, isFetching: fetchingArchived } = useGetADGroupMappingsQuery(archivedQuery);

  const stats = useMemo(() => {
    const active: ADGroupMappingInterface[] = dataActive?.results ?? [];
    const archived: ADGroupMappingInterface[] = dataArchived?.results ?? [];
    const totalActive = dataActive?.count ?? active.length;
    const totalArchived = dataArchived?.count ?? archived.length;
    const all = [...active, ...archived];

    // Role frequency
    const roleMap: Record<string, number> = {};
    all.forEach((m) => { roleMap[m.role_name] = (roleMap[m.role_name] ?? 0) + 1; });
    const byRole = Object.entries(roleMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([role, count]) => ({ role, count }));

    return { totalActive, totalArchived, byRole };
  }, [dataActive, dataArchived]);

  if ((fetchingActive || fetchingArchived) && !(dataActive?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="ad_group_mappings" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.totalActive + stats.totalArchived} icon={<Link2 className="w-5 h-5" />} color="bg-teal-50 dark:bg-teal-950/40 text-teal-600" />
        <StatCard label={t("active") ?? "Actifs"} value={stats.totalActive} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label={t("archived") ?? "Archivés"} value={stats.totalArchived} icon={<Archive className="w-5 h-5" />} color="bg-orange-50 dark:bg-orange-950/40 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_active_archived") && (
          <SimplePie
            title={t("stat_active_archived") ?? "Actifs / Archivés"}
            data={[
              { name: t("active") ?? "Actifs", value: stats.totalActive },
              { name: t("archived") ?? "Archivés", value: stats.totalArchived },
            ]}
            module="ad_group_mappings"
            chartId="pie_active_archived"
          />
        )}

        {isVisible("bar_roles") && stats.byRole.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_mappings_per_role") ?? "Mappings par rôle (Top 10)"}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byRole} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="role" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={120} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, "Mappings"]} />
                <Bar dataKey="count" fill={getChartColor("bar_roles", 2)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
