"use client";
import { BASE_API_URL } from "@/constants/env";
import { SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_http_status", label: "Par statut HTTP" },
  { id: "bar_method",      label: "Par méthode HTTP",   colorIndex: 1 },
  { id: "bar_top_users",   label: "Top utilisateurs",   colorIndex: 4 },
  { id: "bar_endpoints",   label: "Top endpoints",      colorIndex: 0 },
];

interface ConnectionLog {
  id: number;
  username: string;
  timestamp: string;
  ip_address: string;
  endpoint: string;
  method: string;
  status_code: number;
  duration_ms: number;
}

interface PaginatedLogs { count: number; results: ConnectionLog[] }

interface Props { readonly filterQuery?: string }

export default function LogsStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("logs", CHARTS.map((c) => c.id));
  const [data, setData] = useState<PaginatedLogs | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch500 = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        const parsed = token ? JSON.parse(token) : null;
        const params = new URLSearchParams(filterQuery || "");
        params.delete("page");
        params.set("size", "500");
        params.append("page", "0");
        const res = await fetch(`${BASE_API_URL}auth/connection-logs/?${params}`, {
          headers: { Authorization: parsed ? `Bearer ${parsed}` : "" },
        });
        setData(await res.json());
      } catch { setData(null); }
      finally { setLoading(false); }
    };
    fetch500();
  }, [filterQuery]);

  const stats = useMemo(() => {
    const logs: ConnectionLog[] = data?.results ?? [];
    const total = data?.count ?? logs.length;
    const success = logs.filter((l) => l.status_code < 300).length;
    const redirect = logs.filter((l) => l.status_code >= 300 && l.status_code < 400).length;
    const clientErr = logs.filter((l) => l.status_code >= 400 && l.status_code < 500).length;
    const serverErr = logs.filter((l) => l.status_code >= 500).length;

    const methodMap: Record<string, number> = {};
    logs.forEach((l) => { methodMap[l.method] = (methodMap[l.method] ?? 0) + 1; });
    const byMethod = Object.entries(methodMap).map(([method, count]) => ({ method, count }));

    const endpointMap: Record<string, number> = {};
    logs.forEach((l) => {
      const ep = l.endpoint.split("?")[0].replace(/\/\d+\//g, "/{id}/");
      endpointMap[ep] = (endpointMap[ep] ?? 0) + 1;
    });
    const topEndpoints = Object.entries(endpointMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    const userMap: Record<string, number> = {};
    logs.forEach((l) => { if (l.username) userMap[l.username] = (userMap[l.username] ?? 0) + 1; });
    const topUsers = Object.entries(userMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([username, count]) => ({ username, count }));

    return { total, success, redirect, clientErr, serverErr, byMethod, topEndpoints, topUsers };
  }, [data]);

  if (loading && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="logs" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<Activity className="w-5 h-5" />} color="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600" />
        <StatCard label={t("stat_success") ?? "Succès (2xx)"} value={stats.success} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label={t("stat_client_errors") ?? "Erreurs client (4xx)"} value={stats.clientErr} icon={<AlertTriangle className="w-5 h-5" />} color="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600" />
        <StatCard label={t("stat_server_errors") ?? "Erreurs serveur (5xx)"} value={stats.serverErr} icon={<XCircle className="w-5 h-5" />} color="bg-red-50 dark:bg-red-950/40 text-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isVisible("pie_http_status") && (
          <SimplePie
            title={t("stat_by_status") ?? "Par statut HTTP"}
            data={[
              { name: "2xx Succès", value: stats.success },
              { name: "3xx Redirect", value: stats.redirect },
              { name: "4xx Client", value: stats.clientErr },
              { name: "5xx Serveur", value: stats.serverErr },
            ].filter((d) => d.value > 0)}
            module="logs"
            chartId="pie_http_status"
          />
        )}

        {isVisible("bar_method") && stats.byMethod.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_by_method") ?? "Par méthode HTTP"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byMethod}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="method" tick={TICK_STYLE} stroke="var(--muted-foreground)" />
                <YAxis tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" fill={getChartColor("bar_method", 1)} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {isVisible("bar_top_users") && stats.topUsers.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_top_users") ?? "Top utilisateurs"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.topUsers} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="username" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={100} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" fill={getChartColor("bar_top_users", 4)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {isVisible("bar_endpoints") && stats.topEndpoints.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 xl:col-span-3">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_top_endpoints") ?? "Endpoints les plus appelés (Top 10)"}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.topEndpoints} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="endpoint" tick={{ ...TICK_STYLE, fontSize: 10 }} stroke="var(--muted-foreground)" width={200} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" fill={getChartColor("bar_endpoints", 0)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
