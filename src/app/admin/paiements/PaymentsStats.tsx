"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetAllPaymentsQuery } from "@/store/apis/payment/payment.api";
import { Payment, PaymentStatusType } from "@/types/payment.types";
import { CreditCard, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_status",  label: "Répartition par statut" },
  { id: "bar_method",  label: "Montant par méthode",      colorIndex: 0 },
  { id: "line_months", label: "Évolution des paiements",  colorIndex: 0 },
];

interface Props { readonly filterQuery?: string }

const STATUS_LABEL: Record<PaymentStatusType, string> = {
  pending: "En attente", processing: "En cours", completed: "Complété",
  failed: "Échoué", cancelled: "Annulé", refunded: "Remboursé",
};
const METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Virement", paypal: "PayPal",
  orange_money: "Orange Money", mtn_money: "MTN MoMo",
};

export default function PaymentsStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { isVisible, colors, getChartColor } = useStatsConfig("payments", CHARTS.map((c) => c.id));
  const { data, isFetching } = useGetAllPaymentsQuery(buildStatsQuery(filterQuery));
  const stats = useMemo(() => {
    const payments: Payment[] = data?.results ?? [];
    const total      = data?.count ?? payments.length;
    const totalAmount = payments.reduce((s, p) => s + Number(p.amount), 0);
    const completed  = payments.filter((p) => p.status === "completed").length;
    const pending    = payments.filter((p) => p.status === "pending").length;
    const failed     = payments.filter((p) => p.status === "failed").length;
    const completedAmount = payments.filter((p) => p.status === "completed").reduce((s, p) => s + Number(p.amount), 0);

    // By status
    const statusMap: Partial<Record<PaymentStatusType, number>> = {};
    payments.forEach((p) => { statusMap[p.status] = (statusMap[p.status] ?? 0) + 1; });
    const byStatus = Object.entries(statusMap).map(([status, count]) => ({
      name: STATUS_LABEL[status as PaymentStatusType] ?? status,
      count,
    }));

    // Amount by method
    const methodAmount: Record<string, number> = {};
    payments.forEach((p) => {
      const m = METHOD_LABEL[p.payment_method] ?? p.payment_method;
      methodAmount[m] = (methodAmount[m] ?? 0) + Number(p.amount);
    });
    const byMethod = Object.entries(methodAmount)
      .sort(([, a], [, b]) => b - a)
      .map(([name, amount]) => ({ name, amount: Math.round(amount) }));

    // By month
    const monthMap: Record<string, { count: number; amount: number }> = {};
    payments.forEach((p) => {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { count: 0, amount: 0 };
      monthMap[key].count++;
      monthMap[key].amount += Number(p.amount);
    });
    const byMonth = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-9)
      .map(([month, v]) => ({ month, count: v.count, amount: Math.round(v.amount) }));

    return { total, totalAmount, completed, pending, failed, completedAmount, byStatus, byMethod, byMonth };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  const currency = data?.results?.[0]?.currency ?? "XAF";
  const fmt = (n: number) => n.toLocaleString("fr-FR") + " " + currency;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="payments" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label={t("stat_total") ?? "Total"} value={stats.total} icon={<CreditCard className="w-5 h-5" />} color="bg-blue-50 dark:bg-blue-950/40 text-blue-600" />
        <StatCard label={t("stat_total_amount") ?? "Montant total"} value={fmt(stats.totalAmount)} icon={<TrendingUp className="w-5 h-5" />} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" />
        <StatCard label={t("stat_completed") ?? "Complétés"} value={stats.completed} icon={<CreditCard className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label={t("stat_pending") ?? "En attente"} value={stats.pending} icon={<CreditCard className="w-5 h-5" />} color="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600" />
        <StatCard label={t("stat_failed") ?? "Échoués"} value={stats.failed} icon={<CreditCard className="w-5 h-5" />} color="bg-red-50 dark:bg-red-950/40 text-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isVisible("pie_status") && (
          <SimplePie
            title={t("stat_by_status") ?? "Répartition par statut"}
            data={stats.byStatus.map((s) => ({ name: s.name, value: s.count ?? 0 }))}
            module="payments"
            chartId="pie_status"
          />
        )}

        {isVisible("bar_method") && stats.byMethod.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_amount_by_method") ?? "Montant par méthode"}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byMethod} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ ...TICK_STYLE, fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                <YAxis type="category" dataKey="name" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={100} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [fmt(v), currency]} />
                <Bar dataKey="amount" fill={getChartColor("bar_method", 0)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <StatCard
          label={t("stat_completed_amount") ?? "Montant complété"}
          value={fmt(stats.completedAmount)}
          sub={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% des transactions` : ""}
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
        />

        {isVisible("line_months") && stats.byMonth.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-2 xl:col-span-3">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t("stat_payments_over_time") ?? "Évolution des paiements"}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.byMonth} margin={{ right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={TICK_STYLE} stroke="var(--muted-foreground)" />
                <YAxis yAxisId="count" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis yAxisId="amount" orientation="right" tick={{ ...TICK_STYLE, fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
                <Tooltip {...TOOLTIP_PROPS} />
                <Line yAxisId="count" type="monotone" dataKey="count" name={t("stat_total") ?? "Nombre"} stroke={getChartColor("line_months", 0)} strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="amount" type="monotone" dataKey="amount" name={`Montant (${currency})`} stroke={colors[1]} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
