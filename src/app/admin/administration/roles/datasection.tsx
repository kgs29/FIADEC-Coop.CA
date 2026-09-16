"use client";
import { BulkActionBar } from "@/components/BulkActionBar";
import { ImportModal } from "@/components/ImportModal";
import { SortableHeader } from "@/components/SortableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSelection } from "@/hooks/useTableSelection";
import { useTableSort } from "@/hooks/useTableSort";
import { exportToCsv, exportToExcel } from "@/lib/exportTable";
import { bulkDelete, bulkArchive, importFile } from "@/lib/bulkApi";
import {
  useArchiveRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "@/store/apis/auth/authentication.api";
import { RoleInterface } from "@/types/rule.type";
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
  archived?: boolean;
}

const ROLES_RESOURCE = "auth/roles";

const DataSection = ({ onFiltersChange, externalSearch, archived = false }: DataSectionProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { page, setPage, pageSize, setPageSize, getPaginationRange: buildRange } = usePaginatedTable(externalSearch);
  const [importOpen, setImportOpen] = useState(false);

  const { data, isFetching, refetch } = useGetRolesQuery(
    [
      `page=${page - 1}`,
      `size=${pageSize}`,
      `archived=${archived}`,
      externalSearch ? `search=${encodeURIComponent(externalSearch)}` : "",
    ].filter(Boolean).join("&")
  );

  const [_deleteRole] = useDeleteRoleMutation();
  const [_archiveRole] = useArchiveRoleMutation();

  const roles: RoleInterface[] = data?.results ?? [];
  const { filtered, setQuery } = useTableSearch(roles as unknown as Record<string, unknown>[], ["name"]);

  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(`archived=${archived}`); }, [archived, onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displayRoles = sorted as unknown as RoleInterface[];
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;
  const getPaginationRange = () => buildRange(totalPages);

  const sel = useTableSelection(roles);

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${sel.selectedCount} rôle(s) ?`)) return;
    try { await bulkDelete(ROLES_RESOURCE, sel.selectedIds); toast.success(t("deleted_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleBulkArchive = async () => {
    if (!confirm(`Archiver ${sel.selectedCount} rôle(s) ?`)) return;
    try { await bulkArchive(ROLES_RESOURCE, sel.selectedIds); toast.success(t("archived_successfully")); sel.clearSelection(); refetch(); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleExportExcel = () =>
    exportToExcel(roles.filter((r) => sel.selectedIds.includes(String(r.id))).map((r) => ({ id: r.id, name: r.name })), "roles");

  const handleExportCsv = () =>
    exportToCsv(roles.filter((r) => sel.selectedIds.includes(String(r.id))).map((r) => ({ id: r.id, name: r.name })), "roles");

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
                  <SortableHeader label={t("name")} sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide hidden md:table-cell">{t("groups")}</th>
                  <SortableHeader label={t("users_count")} sortKey="users_count" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {displayRoles.map((role: RoleInterface) => (
                  <tr
                    key={role.id}
                    className={`border-t hover:bg-muted/30 transition-colors cursor-pointer ${sel.isSelected(role.id) ? "bg-primary/5" : ""}`}
                    onClick={() => router.push(`${pathname}/${role.id}`)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={sel.isSelected(role.id)} onCheckedChange={() => sel.toggle(role.id)} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{role.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {role.groups.length === 0 ? <span className="text-muted-foreground text-xs">{t("no_groups")}</span> : role.groups.map((g) => (
                          <span key={g.id} className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{g.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{role.users_count}</td>
                  </tr>
                ))}
                {displayRoles.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">{t("no_data")}</td></tr>}
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
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={(f) => importFile(ROLES_RESOURCE, f)} resourceName="Rôles" templateFields={["name"]} />
    </div>
  );
};

export default DataSection;
