"use client";
import { BASE_API_URL } from "@/constants/env";
import { SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { CheckCircle, Mail, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_status", label: "Par statut" },
  { id: "bar_months", label: "Messages par mois", colorIndex: 3 },
];

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: "new" | "read" | "replied";
  created_at: string;
}
interface Paginated { count: number; results: ContactMessage[] }

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  const parsed = token ? JSON.parse(token) : null;
  return { Authorization: parsed ? `Bearer ${parsed}` : "" };
};

interface Props { readonly filterQuery?: string }

export default function ContactsStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, getChartColor } = useStatsConfig("contacts", CHARTS.map((c) => c.id));
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
        const res = await fetch(`${BASE_API_URL}core/contacts/?${params}`, { headers: getAuthHeaders() });
        setData(await res.json());
      } catch { setData(null); }
      finally { setLoading(false); }
    };
    load();
  }, [filterQuery]);

  const stats = useMemo(() => {
    const contacts: ContactMessage[] = data?.results ?? [];
    const total = data?.count ?? contacts.length;
    const newContacts = contacts.filter((c) => c.status === "new").length;
    const read = contacts.filter((c) => c.status === "read").length;
    const replied = contacts.filter((c) => c.status === "replied").length;

    const byMonth: Record<string, number> = {};
    contacts.forEach((c) => {
      const month = new Date(c.created_at).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      byMonth[month] = (byMonth[month] ?? 0) + 1;
    });
    const byMonthData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));

    return { total, newContacts, read, replied, byMonthData };
  }, [data]);

  if (loading && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="contacts" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<MessageSquare className="w-5 h-5" />} color="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600" />
        <StatCard label={t("stat_new") ?? "Nouveaux"} value={stats.newContacts} icon={<Mail className="w-5 h-5" />} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" />
        <StatCard label={t("stat_read") ?? "Lus"} value={stats.read} color="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600" />
        <StatCard label={t("stat_replied") ?? "Répondus"} value={stats.replied} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_status") && (
          <SimplePie
            title={t("stat_contacts_by_status") ?? "Par statut"}
            data={[
              { name: t("stat_new") ?? "Nouveau", value: stats.newContacts },
              { name: t("stat_read") ?? "Lu", value: stats.read },
              { name: t("stat_replied") ?? "Répondu", value: stats.replied },
            ].filter((d) => d.value > 0)}
            module="contacts"
            chartId="pie_status"
          />
        )}

        {isVisible("bar_months") && stats.byMonthData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_contacts_by_month") ?? "Messages par mois"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={TICK_STYLE} stroke="var(--muted-foreground)" />
                <YAxis tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar dataKey="count" fill={getChartColor("bar_months", 3)} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
