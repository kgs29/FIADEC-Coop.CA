"use client";
import { BASE_API_URL } from "@/constants/env";
import { SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { Mail, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_status", label: "Actifs / Inactifs" },
  { id: "bar_months", label: "Inscriptions par mois", colorIndex: 0 },
];

interface Subscriber { id: number; email: string; subscribed_at: string; is_active: boolean }
interface Paginated { count: number; results: Subscriber[] }

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  const parsed = token ? JSON.parse(token) : null;
  return { Authorization: parsed ? `Bearer ${parsed}` : "" };
};

interface Props { readonly filterQuery?: string }

export default function NewsletterStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("newsletter", CHARTS.map((c) => c.id));
  const [data, setData] = useState<Paginated | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filterQuery || "");
        params.delete("page");
        params.set("size", "500");
        params.append("page", "0");
        const res = await fetch(`${BASE_API_URL}core/newsletter/?${params}`, { headers: getAuthHeaders() });
        setData(await res.json());
      } catch { setData(null); }
      finally { setLoading(false); }
    };
    load();
  }, [filterQuery]);

  const stats = useMemo(() => {
    const subs: Subscriber[] = data?.results ?? [];
    const total = data?.count ?? subs.length;
    const active = subs.filter((s) => s.is_active).length;
    const inactive = subs.length - active;

    const byMonth: Record<string, number> = {};
    subs.forEach((s) => {
      const month = new Date(s.subscribed_at).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      byMonth[month] = (byMonth[month] ?? 0) + 1;
    });
    const byMonthData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));

    return { total, active, inactive, byMonthData };
  }, [data]);

  if (loading && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="newsletter" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Mail className="w-5 h-5" />} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" />
        <StatCard label={t("active") ?? "Actifs"} value={stats.active} icon={<ToggleRight className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label={t("inactive") ?? "Inactifs"} value={stats.inactive} icon={<ToggleLeft className="w-5 h-5" />} color="bg-gray-50 dark:bg-gray-800/40 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_status") && (
          <SimplePie
            title={t("stat_status_distribution") ?? "Actifs / Inactifs"}
            data={[
              { name: t("active") ?? "Actifs", value: stats.active },
              { name: t("inactive") ?? "Inactifs", value: stats.inactive },
            ]}
            module="newsletter"
            chartId="pie_status"
          />
        )}

        {isVisible("bar_months") && stats.byMonthData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_subscriptions_by_month") ?? "Inscriptions par mois"}
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
