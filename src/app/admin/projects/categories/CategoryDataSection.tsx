"use client";
import { BulkActionBar } from "@/components/BulkActionBar";
import { ImportModal } from "@/components/ImportModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSelection } from "@/hooks/useTableSelection";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { exportToCsv, exportToExcel } from "@/lib/exportTable";
import { bulkArchive, bulkDelete, importFile } from "@/lib/bulkApi";
import {
  useDeleteProjectCategoryMutation,
  useGetProjectCategoriesQuery,
} from "@/store/apis/core/project.api";
import { ProjectCategory } from "@/types/project.types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface CategoryDataSectionProps {
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
}

const CATEGORIES_RESOURCE = "projects/categories";

const CategoryDataSection = ({ onFiltersChange, externalSearch }: CategoryDataSectionProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { page, setPage, pageSize, setPageSize, getPaginationRange: buildRange } = usePaginatedTable(externalSearch);

  const { data, isFetching, refetch } = useGetProjectCategoriesQuery(
    [`page=${page - 1}`, `size=${pageSize}`, externalSearch ? `search=${encodeURIComponent(externalSearch)}` : ""].filter(Boolean).join("&")
  );

  const [_deleteCategory] = useDeleteProjectCategoryMutation();
  const allCategories: ProjectCategory[] = data?.results ?? [];
  const { filtered, setQuery } = useTableSearch(allCategories as unknown as Record<string, unknown>[], ["name", "slug", "description"]);
  const categories = filtered as unknown as ProjectCategory[];
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(""); }, [onFiltersChange]);

  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;
  const getPaginationRange = () => buildRange(totalPages);

  const sel = useTableSelection(categories);
  const selectedCats = categories.filter((c) => sel.selectedIds.includes(String(c.id)));

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${sel.selectedCount} catégorie(s) ?`)) return;
    try { await bulkDelete(CATEGORIES_RESOURCE, sel.selectedIds); toast.success(t("deleted_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleBulkArchive = async () => {
    try { await bulkArchive(CATEGORIES_RESOURCE, sel.selectedIds); toast.success(t("categories_archived")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleExportExcel = () =>
    exportToExcel(selectedCats.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, is_active: c.is_active })), "categories-projets");

  const handleExportCsv = () =>
    exportToCsv(selectedCats.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, is_active: c.is_active })), "categories-projets");

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
                  <th className="px-4 py-3">{t("name")}</th>
                  <th className="px-4 py-3 hidden md:table-cell">Slug</th>
                  <th className="px-4 py-3 hidden lg:table-cell">{t("description")}</th>
                  <th className="px-4 py-3">{t("active")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat: ProjectCategory) => (
                  <tr
                    key={cat.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${sel.isSelected(cat.id) ? "bg-primary/5" : ""}`}
                    onClick={() => router.push(`${pathname}/${cat.id}`)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={sel.isSelected(cat.id)} onCheckedChange={() => sel.toggle(cat.id)} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate hidden lg:table-cell">{cat.description || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {cat.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">{t("no_data")}</td></tr>}
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
      <ImportModal open={false} onClose={() => {}} onImport={(f) => importFile(CATEGORIES_RESOURCE, f)} resourceName="Catégories projets" templateFields={["name", "description", "is_active"]} />
    </div>
  );
};

export default CategoryDataSection;
