"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetUsersQuery } from "@/store/apis/auth/authentication.api";
import { User } from "@/types/auth.types";
import { ShieldCheck, UserCheck, UserMinus, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

interface Props {
  readonly filterQuery?: string;
}

const CHARTS = [
  { id: "pie_active",        label: "Actifs / Inactifs" },
  { id: "pie_types",         label: "Types d'utilisateurs" },
  { id: "bar_security",      label: "Sécurité (2FA / Captcha)", colorIndex: 0 },
  { id: "bar_registrations", label: "Inscriptions par mois",    colorIndex: 0 },
];

const MODULE = "users";
const AXIS_STROKE = "var(--muted-foreground)";

export default function UsersStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, colors, getChartColor } = useStatsConfig(MODULE, CHARTS.map((c) => c.id));
  const { data, isFetching } = useGetUsersQuery(buildStatsQuery(filterQuery));
  const stats = useMemo(() => {
    const users: User[] = data?.results ?? [];
    const total      = data?.count ?? users.length;
    const active     = users.filter((u) => u.is_active).length;
    const inactive   = users.filter((u) => !u.is_active).length;
    const staff      = users.filter((u) => u.is_staff && !u.is_superuser).length;
    const superusers = users.filter((u) => u.is_superuser).length;
    const regular    = users.filter((u) => !u.is_staff && !u.is_superuser).length;
    const twoFA      = users.filter((u) => u.two_factor_enabled).length;
    const captcha    = users.filter((u) => u.captcha_enabled).length;

    // Registrations by month (last 6 months)
    const monthMap: Record<string, number> = {};
    users.forEach((u) => {
      if (u.date_joined) {
        const d = new Date(u.date_joined);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap[key] = (monthMap[key] ?? 0) + 1;
      }
    });
    const months = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));

    return { total, active, inactive, staff, superusers, regular, twoFA, captcha, months };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  const securityData = [
    { name: t("stat_2fa") ?? "2FA activé", value: stats.twoFA, fill: getChartColor("bar_security", 0) },
    { name: t("stat_captcha") ?? "Captcha activé", value: stats.captcha, fill: colors[4] },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Config button */}
      <div className="flex justify-end">
        <StatsConfigPanel module={MODULE} charts={CHARTS.map((c) => ({ id: c.id, label: c.label }))} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Users className="w-5 h-5" />} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" />
        <StatCard label={t("active") ?? "Actifs"} value={stats.active} icon={<UserCheck className="w-5 h-5" />} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" />
        <StatCard label={t("inactive") ?? "Inactifs"} value={stats.inactive} icon={<UserMinus className="w-5 h-5" />} color="bg-red-50 dark:bg-red-950/40 text-red-600" />
        <StatCard label="Staff" value={stats.staff} icon={<ShieldCheck className="w-5 h-5" />} color="bg-violet-50 dark:bg-violet-950/40 text-violet-600" />
        <StatCard label="Superusers" value={stats.superusers} icon={<ShieldCheck className="w-5 h-5" />} color="bg-orange-50 dark:bg-orange-950/40 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isVisible("pie_active") && (
          <SimplePie
            title={t("stat_active_inactive") ?? "Actifs / Inactifs"}
            data={[
              { name: t("active") ?? "Actifs", value: stats.active },
              { name: t("inactive") ?? "Inactifs", value: stats.inactive },
            ]}
            module={MODULE}
            chartId="pie_active"
          />
        )}

        {isVisible("pie_types") && (
          <SimplePie
            title={t("stat_user_types") ?? "Types d'utilisateurs"}
            data={[
              { name: "Standard", value: stats.regular },
              { name: "Staff", value: stats.staff },
              { name: "Superuser", value: stats.superusers },
            ]}
            module={MODULE}
            chartId="pie_types"
          />
        )}

        {isVisible("bar_security") && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("stat_security") ?? "Sécurité"}</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={securityData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke={AXIS_STROKE} domain={[0, stats.total || 1]} />
                <YAxis type="category" dataKey="name" tick={TICK_STYLE} stroke={AXIS_STROKE} width={110} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, ""]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {securityData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {isVisible("bar_registrations") && stats.months.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 xl:col-span-3">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("stat_registrations") ?? "Inscriptions par mois"}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.months} margin={{ right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={TICK_STYLE} stroke={AXIS_STROKE} />
                <YAxis tick={TICK_STYLE} stroke={AXIS_STROKE} allowDecimals={false} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" name={t("stat_registrations") ?? "Inscriptions"} fill={getChartColor("bar_registrations", 0)} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
