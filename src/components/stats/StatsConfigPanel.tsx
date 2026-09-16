"use client";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { Settings } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ChartDef {
  id: string;
  label: string;
  /** Natural fallback index in the global palette (for bars/lines). Omit for pie charts. */
  colorIndex?: number;
}

interface Props {
  module: string;
  charts: ChartDef[];
}

export function StatsConfigPanel({ module, charts }: Props) {
  const { t } = useTranslation();
  const { isVisible, toggle, getChartColor, setChartColor, hiddenCount } =
    useStatsConfig(module, charts.map((c) => c.id));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
        title={t("stats_config") ?? "Configurer les graphiques"}
      >
        <Settings className="w-3.5 h-3.5" />
        {t("stats_config") ?? "Configurer"}
        {hiddenCount > 0 && (
          <span className="ml-1 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 leading-none">
            {hiddenCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-lg p-4 min-w-64">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {t("stats_visible_charts") ?? "Graphiques visibles"}
            </p>
            <div className="space-y-3">
              {charts.map((chart) => (
                <div key={chart.id} className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isVisible(chart.id)}
                      onChange={() => toggle(chart.id)}
                      className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {chart.label}
                    </span>
                  </label>
                  <input
                    type="color"
                    value={getChartColor(chart.id, chart.colorIndex ?? 0)}
                    onChange={(e) => setChartColor(chart.id, e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-border p-0 shrink-0"
                    title={t("chart_color")}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
