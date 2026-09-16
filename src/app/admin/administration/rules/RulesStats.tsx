"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetRulesQuery } from "@/store/apis/auth/authentication.api";
import { RuleInterface } from "@/types/rule.type";
import { Shield, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_perms",       label: "Avec / Sans permissions" },
  { id: "bar_perms_count", label: "Permissions par groupe", colorIndex: 0 },
];

interface Props { readonly filterQuery?: string }

const MODULE = "rules";

export default function RulesStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig(MODULE, CHARTS.map((c) => c.id));
  const { data, isFetching } = useGetRulesQuery(buildStatsQuery(filterQuery));
  const stats = useMemo(() => {
    const rules: RuleInterface[] = data?.results ?? [];
    const total = data?.count ?? rules.length;
    const withPerms = rules.filter((r) => (r.permissions?.length ?? 0) > 0).length;
    const empty = rules.length - withPerms;

    const byPerms = rules
      .map((r) => ({ name: r.name, count: r.permissions?.length ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { total, withPerms, empty, byPerms };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module={MODULE} charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Shield className="w-5 h-5" />} color="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600" />
        <StatCard label={t("stat_with_permissions") ?? "Avec permissions"} value={stats.withPerms} icon={<ShieldCheck className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label={t("stat_empty_groups") ?? "Sans permissions"} value={stats.empty} color="bg-gray-50 dark:bg-gray-800/40 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_perms") && (
          <SimplePie
            title={t("stat_groups_by_perms") ?? "Groupes avec / sans permissions"}
            data={[
              { name: t("stat_with_permissions") ?? "Avec permissions", value: stats.withPerms },
              { name: t("stat_empty_groups") ?? "Sans permissions", value: stats.empty },
            ]}
            module={MODULE}
            chartId="pie_perms"
          />
        )}

        {isVisible("bar_perms_count") && stats.byPerms.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_permissions_per_group") ?? "Permissions par groupe (Top 10)"}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byPerms} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={120} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, t("permissions") ?? "Permissions"]} />
                <Bar dataKey="count" fill={getChartColor("bar_perms_count", 0)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
