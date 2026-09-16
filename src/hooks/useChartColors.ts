"use client";
import { useGetStatsConfigQuery } from "@/store/apis/auth/authentication.api";
import { DEFAULT_CHART_COLORS, DEFAULT_DARK_CHART_COLORS } from "./useStatsConfig";
import { useIsDark } from "./useIsDark";

export function useChartColors(): string[] {
  const isDark = useIsDark();
  const { data } = useGetStatsConfigQuery("__global__");
  const defaults = isDark ? DEFAULT_DARK_CHART_COLORS : DEFAULT_CHART_COLORS;
  const prefix = isDark ? "dark_color_" : "color_";
  if (!data?.config) return defaults;
  return defaults.map((def, i) => {
    const saved = data.config[`${prefix}${i}`];
    return typeof saved === "string" && /^#[0-9A-Fa-f]{6}$/.test(saved) ? saved : def;
  });
}
