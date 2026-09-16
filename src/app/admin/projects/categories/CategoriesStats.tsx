"use client";
import { buildStatsQuery, StatCard, StatsLoader } from "@/components/stats/StatsShared";
import { useGetProjectCategoriesQuery } from "@/store/apis/core/project.api";
import { ProjectCategory } from "@/types/project.types";
import { FolderOpen } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props { readonly filterQuery?: string }

export default function CategoriesStats({ filterQuery = "" }: Props) {
  const { t } = useTranslation();
  const { data, isFetching } = useGetProjectCategoriesQuery(buildStatsQuery(filterQuery));
  const stats = useMemo(() => {
    const categories: ProjectCategory[] = data?.results ?? [];
    const total  = data?.count ?? categories.length;
    const active = categories.filter((c) => c.is_active).length;
    return { total, active, inactive: total - active };
  }, [data]);

  if (isFetching && !(data?.results?.length)) return <StatsLoader />;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.total} icon={<FolderOpen className="w-5 h-5" />} color="bg-violet-50 dark:bg-violet-950/40 text-violet-600" />
        <StatCard label={t("active")} value={stats.active} icon={<FolderOpen className="w-5 h-5" />} color="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" />
        <StatCard label={t("inactive")} value={stats.inactive} icon={<FolderOpen className="w-5 h-5" />} color="bg-gray-50 dark:bg-gray-800/40 text-gray-500" />
      </div>
    </div>
  );
}
