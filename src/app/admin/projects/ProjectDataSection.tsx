"use client";
import { BulkActionBar } from "@/components/BulkActionBar";
import { ImportModal } from "@/components/ImportModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTableSelection } from "@/hooks/useTableSelection";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { exportToCsv, exportToExcel } from "@/lib/exportTable";
import { bulkArchive, bulkDelete, importFile } from "@/lib/bulkApi";
import { useDeleteProjectMutation, useGetProjectsQuery } from "@/store/apis/core/project.api";
import { Project } from "@/types/project.types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DollarSign } from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
    status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
  }`}>
    {status === "published" ? "Publié" : "Brouillon"}
  </span>
);

const DifficultyBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    beginner: "bg-emerald-100 text-emerald-700",
    intermediate: "bg-blue-100 text-blue-700",
    advanced: "bg-orange-100 text-orange-700",
    expert: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", expert: "Expert",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[level] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[level] ?? level}
    </span>
  );
};

interface ProjectDataSectionProps {
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
}

const ProjectDataSection = ({ onFiltersChange, externalSearch }: ProjectDataSectionProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { page, setPage, pageSize, setPageSize, getPaginationRange: buildRange } = usePaginatedTable(externalSearch);
  const [importOpen, setImportOpen] = useState(false);
  const [statusFilter] = useState("");

  const { data, isFetching, refetch } = useGetProjectsQuery(
    [
      `page=${page - 1}`,
      `size=${pageSize}`,
      statusFilter ? `status=${statusFilter}` : "",
      externalSearch ? `search=${encodeURIComponent(externalSearch)}` : "",
    ].filter(Boolean).join("&")
  );

  useEffect(() => { onFiltersChange?.(statusFilter ? `status=${statusFilter}` : ""); }, [statusFilter, onFiltersChange]);
  const [_deleteProject] = useDeleteProjectMutation();

  const projects: Project[] = data?.results ?? [];
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;
  const getPaginationRange = () => buildRange(totalPages);

  const sel = useTableSelection(projects);
  const selectedProjects = projects.filter((p) => sel.selectedIds.includes(String(p.id)));

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${sel.selectedCount} projet(s) ?`)) return;
    try { await bulkDelete("projects", sel.selectedIds); toast.success(t("deleted_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleBulkArchive = async () => {
    try { await bulkArchive("projects", sel.selectedIds); toast.success(t("projects_archived")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleExportExcel = () =>
    exportToExcel(selectedProjects.map((p) => ({ id: p.id, title: p.title, status: p.status, difficulty_level: p.difficulty_level, author: p.author_name, category: p.category_name, price: p.price })), "projets");

  const handleExportCsv = () =>
    exportToCsv(selectedProjects.map((p) => ({ id: p.id, title: p.title, status: p.status, difficulty_level: p.difficulty_level, author: p.author_name, category: p.category_name, price: p.price })), "projets");

  return (
    <div className="bg-white p-4 sm:p-7 overflow-hidden space-y-3">
      <BulkActionBar
        selectedCount={sel.selectedCount}
        onClear={sel.clearSelection}
        actions={{ onDelete: handleBulkDelete, onArchive: handleBulkArchive, onExportExcel: handleExportExcel, onExportCsv: handleExportCsv }}
      />
      {isFetching ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 w-10"><Checkbox checked={sel.isAllSelected} data-state={sel.isIndeterminate ? "indeterminate" : undefined} onCheckedChange={sel.toggleAll} /></th>
                  <th className="px-4 py-3">{t("title")}</th>
                  <th className="px-4 py-3 hidden lg:table-cell">{t("category")}</th>
                  <th className="px-4 py-3 hidden md:table-cell">{t("level")}</th>
                  <th className="px-4 py-3 hidden lg:table-cell">{t("technologies")}</th>
                  <th className="px-4 py-3">{t("status")}</th>
                  <th className="px-4 py-3 hidden md:table-cell">{t("price")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project: Project) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${sel.isSelected(project.id) ? "bg-primary/5" : ""}`}
                    onClick={() => router.push(`${pathname}/${project.id}`)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={sel.isSelected(project.id)} onCheckedChange={() => sel.toggle(project.id)} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{project.title}</td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{project.category_name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {project.difficulty_level && <DifficultyBadge level={project.difficulty_level} />}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell max-w-[160px] truncate">
                      {project.technologies || "—"}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {project.is_purchasable && project.price ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <DollarSign className="w-3 h-3" />{Number(project.price).toLocaleString("fr-FR")} XOF
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">{t("free")}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">{t("no_data")}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-gray-500 dark:text-white whitespace-nowrap">{t("rows_per_page")}</Label>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent><SelectGroup>{[10, 25, 50, 100].map((n) => (<SelectItem key={n} value={n.toString()}>{n}</SelectItem>))}</SelectGroup></SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} onClick={() => setPage((p) => Math.max(1, p - 1))} /></PaginationItem>
                {(() => { let ec = 0; return getPaginationRange().map((p) => p === "ellipsis" ? (<PaginationItem key={`ellipsis-${++ec}`}><PaginationEllipsis /></PaginationItem>) : (<PaginationItem key={`page-${p}`}><PaginationLink isActive={page === p} className={page === p ? "bg-secondary text-white dark:text-white pointer-events-none cursor-default" : "cursor-pointer"} onClick={() => setPage(p)}>{p}</PaginationLink></PaginationItem>))})()}
                <PaginationItem><PaginationNext className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={(f) => importFile("projects", f)} resourceName="Projets" templateFields={["title", "content", "excerpt", "category_name", "status", "technologies", "difficulty_level"]} />
    </div>
  );
};

export default ProjectDataSection;
