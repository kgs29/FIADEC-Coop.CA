"use client";
import { BulkActionBar } from "@/components/BulkActionBar";
import { SortableHeader } from "@/components/SortableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSelection } from "@/hooks/useTableSelection";
import { useTableSort } from "@/hooks/useTableSort";
import { bulkArchive, bulkDelete } from "@/lib/bulkApi";
import { exportToCsv, exportToExcel } from "@/lib/exportTable";
import {
  useDeleteADGroupMappingMutation,
  useGetADGroupMappingsQuery,
} from "@/store/apis/auth/authentication.api";
import { ADGroupMappingInterface } from "@/types/rule.type";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface DataSectionProps {
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
  archived?: boolean;
}

const DataSection = ({ onFiltersChange, externalSearch, archived = false }: DataSectionProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { page, setPage, pageSize, setPageSize, getPaginationRange: buildRange } = usePaginatedTable(externalSearch);

  const { data, isFetching, refetch } = useGetADGroupMappingsQuery(
    [
      `page=${page - 1}`,
      `size=${pageSize}`,
      `archived=${archived}`,
      externalSearch ? `search=${encodeURIComponent(externalSearch)}` : "",
    ].filter(Boolean).join("&")
  );

  const [_deleteMapping] = useDeleteADGroupMappingMutation();

  const mappings: ADGroupMappingInterface[] = data?.results ?? [];
  const { filtered, setQuery } = useTableSearch(mappings as unknown as Record<string, unknown>[], ["ad_group_name", "role_name"]);
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(`archived=${archived}`); }, [archived, onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displayMappings = sorted as unknown as ADGroupMappingInterface[];
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;
  const getPaginationRange = () => buildRange(totalPages);

  const sel = useTableSelection(mappings);

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${sel.selectedCount} mapping(s) ?`)) return;
    try { await bulkDelete("auth/ad-group-mappings", sel.selectedIds); toast.success(t("deleted_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleBulkArchive = async () => {
    if (!confirm(`Archiver ${sel.selectedCount} mapping(s) ?`)) return;
    try { await bulkArchive("auth/ad-group-mappings", sel.selectedIds); toast.success(t("archived_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleExportExcel = () =>
    exportToExcel(mappings.filter((m) => sel.selectedIds.includes(String(m.id))).map((m) => ({ id: m.id, ad_group_name: m.ad_group_name, role: m.role_name })), "ad-group-mappings");

  const handleExportCsv = () =>
    exportToCsv(mappings.filter((m) => sel.selectedIds.includes(String(m.id))).map((m) => ({ id: m.id, ad_group_name: m.ad_group_name, role: m.role_name })), "ad-group-mappings");

  return (
    <div className="p-6 space-y-4">
      <BulkActionBar
        selectedCount={sel.selectedCount}
        onClear={sel.clearSelection}
        actions={{ onDelete: handleBulkDelete, onArchive: handleBulkArchive, onExportExcel: handleExportExcel, onExportCsv: handleExportCsv }}
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
                  <SortableHeader label={t("ad_group_name")} sortKey="ad_group_name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={t("role")} sortKey="role_name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {displayMappings.map((m: ADGroupMappingInterface) => (
                  <tr
                    key={m.id}
                    className={`border-t hover:bg-muted/30 transition-colors cursor-pointer ${sel.isSelected(m.id) ? "bg-primary/5" : ""}`}
                    onClick={() => router.push(`${pathname}/${m.id}`)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={sel.isSelected(m.id)} onCheckedChange={() => sel.toggle(m.id)} />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-foreground">{m.ad_group_name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{m.role_name}</span>
                    </td>
                  </tr>
                ))}
                {displayMappings.length === 0 && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">{t("no_data")}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground dark:text-white whitespace-nowrap">{t("rows_per_page")}</Label>
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
    </div>
  );
};

export default DataSection;
