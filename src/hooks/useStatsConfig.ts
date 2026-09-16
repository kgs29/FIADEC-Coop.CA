"use client";
import {
  AuthenticationApi,
  useGetStatsConfigQuery,
  useUpdateStatsConfigMutation,
} from "@/store/apis/auth/authentication.api";
import { useIsDark } from "@/hooks/useIsDark";
import { useChartColors } from "@/hooks/useChartColors";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export const DEFAULT_CHART_COLORS = [
  "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

export const DEFAULT_DARK_CHART_COLORS = [
  "#818cf8", "#4ade80", "#fbbf24", "#f87171", "#60a5fa",
  "#a78bfa", "#f472b6", "#2dd4bf", "#fb923c", "#a3e635",
];

const LS_KEY = (m: string) => `stats_config_${m}`;

function readLocal(module: string): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(LS_KEY(module));
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch { return {}; }
}

function writeLocal(module: string, config: Record<string, unknown>) {
  try { localStorage.setItem(LS_KEY(module), JSON.stringify(config)); } catch {}
}

export function useStatsConfig(module: string, charts: string[]) {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetStatsConfigQuery(module);
  const [updateConfig] = useUpdateStatsConfigMutation();

  const isDark = useIsDark();
  const colors = useChartColors();

  // Active config: prefer RTK cache, fall back to localStorage
  const activeConfig: Record<string, unknown> = data?.config ?? readLocal(module);

  const isVisible = useCallback(
    (chartId: string): boolean => {
      if (!(chartId in activeConfig)) return true;
      return activeConfig[chartId] === true;
    },
    [activeConfig]
  );

  const _save = useCallback(
    (updated: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(AuthenticationApi.util.updateQueryData("getStatsConfig", module, (draft) => {
        draft.config = updated;
      }) as any);
      writeLocal(module, updated);
      updateConfig({ module, config: updated as Record<string, boolean> });
    },
    [dispatch, module, updateConfig]
  );

  const toggle = useCallback(
    (chartId: string) => {
      const currentlyVisible = activeConfig[chartId] !== false;
      _save({ ...activeConfig, [chartId]: !currentlyVisible });
    },
    [activeConfig, _save]
  );

  const getChartColor = useCallback(
    (chartId: string, fallbackIndex = 0): string => {
      const key = isDark ? `dark_chart_color_${chartId}` : `chart_color_${chartId}`;
      const saved = activeConfig[key];
      if (typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved)) return saved;
      return colors[fallbackIndex % colors.length];
    },
    [activeConfig, isDark, colors]
  );

  const setChartColor = useCallback(
    (chartId: string, color: string) => {
      const key = isDark ? `dark_chart_color_${chartId}` : `chart_color_${chartId}`;
      _save({ ...activeConfig, [key]: color });
    },
    [activeConfig, _save, isDark]
  );

  const visibleCharts = charts.filter(isVisible);
  const hiddenCount = charts.length - visibleCharts.length;

  return { isVisible, toggle, getChartColor, setChartColor, isLoading, hiddenCount, config: activeConfig, colors };
}
