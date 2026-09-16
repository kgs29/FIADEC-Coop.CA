"use client";
import { buildStatsQuery, SimplePie, StatCard, StatsLoader, TICK_STYLE, TOOLTIP_PROPS } from "@/components/stats/StatsShared";
import { StatsConfigPanel } from "@/components/stats/StatsConfigPanel";
import { useStatsConfig } from "@/hooks/useStatsConfig";
import { useGetProjectsQuery } from "@/store/apis/core/project.api";
import { Project } from "@/types/project.types";
import { Code2, DollarSign, Globe, PenLine } from "lucide-react";
import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const CHARTS = [
  { id: "pie_status",      label: "Répartition par statut" },
  { id: "bar_category",    label: "Par catégorie",       colorIndex: 1 },
  { id: "bar_difficulty",  label: "Par niveau",          colorIndex: 3 },
  { id: "bar_purchasable", label: "Gratuit vs Payant",   colorIndex: 2 },
];

interface Props { readonly filterQuery?: string }

export default function ProjectsStats({ filterQuery = "" }: Props) {
  const { isVisible, getChartColor } = useStatsConfig("projects", CHARTS.map((c) => c.id));
  const { data, isFetching } = useGetProjectsQuery(buildStatsQuery(filterQuery));
  const stats = useMemo(() => {
    const projects: Project[] = data?.results ?? [];
    const total      = data?.count ?? projects.length;
    const published  = projects.filter((p) => p.status === "published").length;
    const draft      = projects.filter((p) => p.status === "draft").length;
    const archived   = projects.filter((p) => p.status === "archived").length;
    const purchasable = projects.filter((p) => p.is_purchasable).length;
    const free       = total - purchasable;

    const catMap: Record<string, number> = {};
    projects.forEach((p) => { const c = p.category_name || "—"; catMap[c] = (catMap[c] ?? 0) + 1; });
    const perCategory = Object.entries(catMap).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, count]) => ({ name, count }));

    const diffMap: Record<string, number> = {};
    const labels: Record<string, string> = { beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", expert: "Expert" };
    projects.forEach((p) => { const d = labels[p.difficulty_level] || p.difficulty_level || "—"; diffMap[d] = (diffMap[d] ?? 0) + 1; });
    const perDifficulty = Object.entries(diffMap).map(([name, count]) => ({ name, count }));

    return { total, published, draft, archived, purchasable, free, perCategory, perDifficulty };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <StatsConfigPanel module="projects" charts={CHARTS} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} icon={<Code2 className="w-5 h-5" />} color="bg-violet-50 dark:bg-violet-950/40 text-violet-600" />
        <StatCard label="Publiés" value={stats.published} icon={<Globe className="w-5 h-5" />} color="bg-green-50 dark:bg-green-950/40 text-green-600" />
        <StatCard label="Brouillons" value={stats.draft} icon={<PenLine className="w-5 h-5" />} color="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600" />
        <StatCard label="Archivés" value={stats.archived} icon={<Code2 className="w-5 h-5" />} color="bg-gray-50 dark:bg-gray-800/40 text-gray-500" />
        <StatCard label="Payants" value={stats.purchasable} icon={<DollarSign className="w-5 h-5" />} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isVisible("pie_status") && (
          <SimplePie
            title="Répartition par statut"
            data={[
              { name: "Publiés", value: stats.published },
              { name: "Brouillons", value: stats.draft },
              { name: "Archivés", value: stats.archived },
            ]}
            module="projects"
            chartId="pie_status"
          />
        )}

        {isVisible("bar_purchasable") && (
          <SimplePie
            title="Gratuit vs Payant"
            data={[
              { name: "Gratuit", value: stats.free },
              { name: "Payant", value: stats.purchasable },
            ]}
            module="projects"
            chartId="bar_purchasable"
          />
        )}

        {isVisible("bar_category") && stats.perCategory.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Par catégorie</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.perCategory} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={110} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, "Projets"]} />
                <Bar dataKey="count" fill={getChartColor("bar_category", 1)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {isVisible("bar_difficulty") && stats.perDifficulty.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Par niveau de difficulté</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.perDifficulty} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={TICK_STYLE} stroke="var(--muted-foreground)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={TICK_STYLE} stroke="var(--muted-foreground)" width={110} />
                <Tooltip {...TOOLTIP_PROPS} formatter={(v: number) => [v, "Projets"]} />
                <Bar dataKey="count" fill={getChartColor("bar_difficulty", 3)} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
