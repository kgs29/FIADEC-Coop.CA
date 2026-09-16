"use client";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useGetStatsConfigQuery } from "@/store/apis/auth/authentication.api";
import { useIsDark } from "@/hooks/useIsDark";
import { DEFAULT_DARK_CHART_COLORS } from "@/hooks/useStatsConfig";

/** Shared axis tick style - uses style (CSS property) so CSS variables resolve correctly in SVG */
export const TICK_STYLE = { fontSize: 11, style: { fill: "var(--muted-foreground)" } } as const;

/** Spread onto any <Tooltip> to theme it with the current color scheme */
export const TOOLTIP_PROPS = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--foreground)",
    fontSize: 12,
  },
  labelStyle: { color: "var(--foreground)" },
  itemStyle: { color: "var(--muted-foreground)" },
} as const;

export const CHART_COLORS = [
  "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];


/** Construit la query de stats : remplace page/size et ajoute size=500&page=0 */
export function buildStatsQuery(filterQuery: string): string {
  const params = new URLSearchParams(filterQuery || "");
  params.delete("page");
  params.set("size", "500");
  params.append("page", "0");
  return params.toString();
}

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}
export function StatCard({ label, value, sub, color = "bg-primary/10 text-primary", icon }: Readonly<StatCardProps>) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      {icon && <div className={`p-3 rounded-xl ${color} shrink-0`}>{icon}</div>}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface PieData { name: string; value: number }
interface SimplePieProps {
  readonly data: readonly PieData[];
  readonly title: string;
  readonly colors?: readonly string[];
  /** Module owning this pie - used to look up per-chart color overrides. */
  readonly module?: string;
  /** Chart ID - used to look up `chart_color_{chartId}` in the module config. */
  readonly chartId?: string;
}
export function SimplePie({ data, title, colors: colorsProp, module, chartId }: SimplePieProps) {
  const isDark = useIsDark();
  const { data: globalData } = useGetStatsConfigQuery("__global__");
  const { data: moduleData } = useGetStatsConfigQuery(module ?? "", { skip: !module || !chartId });
  const defaults = isDark ? DEFAULT_DARK_CHART_COLORS : CHART_COLORS;
  const prefix = isDark ? "dark_color_" : "color_";
  const globalColors = defaults.map((def, i) => {
    const saved = globalData?.config?.[`${prefix}${i}`];
    return typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved) ? saved : def;
  });

  let colors: string[];
  if (colorsProp) {
    colors = [...colorsProp];
  } else {
    colors = [...globalColors];
    if (module && chartId && moduleData?.config) {
      const ck = isDark ? `dark_chart_color_${chartId}` : `chart_color_${chartId}`;
      const saved = moduleData.config[ck];
      if (typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved)) colors[0] = saved;
    }
  }
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={[...data]} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
            {data.map((entry, i) => <Cell key={entry.name} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, ""]} />
          <Legend wrapperStyle={{ color: "var(--foreground)", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatsLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
