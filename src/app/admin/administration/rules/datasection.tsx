"use client";
import { BulkActionBar } from "@/components/BulkActionBar";
import { ImportModal } from "@/components/ImportModal";
import { SortableHeader } from "@/components/SortableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSelection } from "@/hooks/useTableSelection";
import { useTableSort } from "@/hooks/useTableSort";
import { exportToCsv, exportToExcel } from "@/lib/exportTable";
import { bulkDelete, importFile } from "@/lib/bulkApi";
import {
  useDeleteRuleMutation,
  useGetRulesQuery,
} from "@/store/apis/auth/authentication.api";
import { RuleInterface } from "@/types/rule.type";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataSectionProps {
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
}

const DataSection = ({ onFiltersChange, externalSearch }: DataSectionProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { page, setPage, pageSize, setPageSize, getPaginationRange: buildRange } = usePaginatedTable(externalSearch);
  const [importOpen, setImportOpen] = useState(false);

  const { data, isFetching, refetch } = useGetRulesQuery(
    [
      `page=${page - 1}`,
      `size=${pageSize}`,
      externalSearch ? `search=${encodeURIComponent(externalSearch)}` : "",
    ].filter(Boolean).join("&")
  );

  const [_deleteRule] = useDeleteRuleMutation();

  const rules: RuleInterface[] = data?.results ?? [];
  const { filtered, setQuery } = useTableSearch(rules as unknown as Record<string, unknown>[], ["name"]);
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(""); }, [onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displayRules = sorted as unknown as RuleInterface[];
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;
  const getPaginationRange = () => buildRange(totalPages);

  const sel = useTableSelection(rules);

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${sel.selectedCount} groupe(s) ?`)) return;
    try { await bulkDelete("auth/groups", sel.selectedIds); toast.success(t("deleted_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleExportExcel = () =>
    exportToExcel(rules.filter((r) => sel.selectedIds.includes(String(r.id))).map((r) => ({ id: r.id, name: r.name })), "groupes");

  const handleExportCsv = () =>
    exportToCsv(rules.filter((r) => sel.selectedIds.includes(String(r.id))).map((r) => ({ id: r.id, name: r.name })), "groupes");

  return (
    <div className="p-6 space-y-4">
      <BulkActionBar
        selectedCount={sel.selectedCount}
        onClear={sel.clearSelection}
        actions={{ onDelete: handleBulkDelete, onExportExcel: handleExportExcel, onExportCsv: handleExportCsv }}
      />
      {/* Search is rendered above the tabs by StatsTabLayout */}
      {isFetching ? (
        <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 w-10 text-left font-medium"><Checkbox checked={sel.isAllSelected} data-state={sel.isIndeterminate ? "indeterminate" : undefined} onCheckedChange={sel.toggleAll} /></th>
                  <SortableHeader label={t("name")} sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide hidden md:table-cell">{t("permissions_count")}</th>
                </tr>
              </thead>
              <tbody>
                {displayRules.map((rule: RuleInterface) => (
                  <tr
                    key={rule.id}
                    className={`border-t hover:bg-muted/30 transition-colors cursor-pointer ${sel.isSelected(rule.id) ? "bg-primary/5" : ""}`}
                    onClick={() => router.push(`${pathname}/${rule.id}`)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={sel.isSelected(rule.id)} onCheckedChange={() => sel.toggle(rule.id)} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{rule.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{rule.permissions?.length ?? 0}</td>
                  </tr>
                ))}
                {displayRules.length === 0 && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">{t("no_data")}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center">
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
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={(f) => importFile("auth/groups", f)} resourceName="Groupes" templateFields={["name"]} />
    </div>
  );
};

export default DataSection;
