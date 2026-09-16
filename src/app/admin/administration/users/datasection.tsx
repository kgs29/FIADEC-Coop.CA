"use client";
import { BulkActionBar } from "@/components/BulkActionBar";
import { ImportModal } from "@/components/ImportModal";
import { SortableHeader } from "@/components/SortableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSelection } from "@/hooks/useTableSelection";
import { useTableSort } from "@/hooks/useTableSort";
import { exportToCsv, exportToExcel } from "@/lib/exportTable";
import {
  useGetUsersQuery,
} from "@/store/apis/auth/authentication.api";
import { User } from "@/types/auth.types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_API_URL } from "@/constants/env";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";

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

  const { data, isFetching, refetch } = useGetUsersQuery(
    [
      `page=${page - 1}`,
      `size=${pageSize}`,
      externalSearch ? `search=${encodeURIComponent(externalSearch)}` : "",
    ].filter(Boolean).join("&")
  );

  const users: User[] = data?.results ?? [];
  const { filtered, setQuery } = useTableSearch(users as unknown as Record<string, unknown>[], ["username", "email", "first_name", "last_name"]);

  // Sync external search (from StatsTabLayout) into table filter
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);

  // Notify parent of non-search filters (search is handled by StatsTabLayout)
  useEffect(() => {
    onFiltersChange?.("");
  }, [onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displayUsers = sorted as unknown as User[];
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;
  const getPaginationRange = () => buildRange(totalPages);

  const { selectedIds, selectedCount, toggle, toggleAll, isSelected, isAllSelected, isIndeterminate, clearSelection } =
    useTableSelection(users);

  const selectedUsers = users.filter((u) => selectedIds.includes(String(u.id)));

  const USERS_BULK_URL = `${BASE_API_URL}auth/users/bulk/`;

  const getAuthHeaders = (withJsonContentType: boolean): HeadersInit => {
    const token = localStorage.getItem("access");
    const headers: Record<string, string> = { Authorization: `Bearer ${JSON.parse(token ?? '""')}` };
    if (withJsonContentType) headers["Content-Type"] = "application/json";
    return headers;
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedCount} utilisateur(s) ?`)) return;
    try {
      await fetch(USERS_BULK_URL, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ action: "delete", ids: selectedIds }),
      });
      toast.success(t("deleted_successfully"));
      clearSelection();
      refetch();
    } catch { toast.error(t("an_error_occurred")); }
  };

  const handleBulkArchive = async () => {
    try {
      await fetch(USERS_BULK_URL, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ action: "archive", ids: selectedIds }),
      });
      toast.success(t("users_archived"));
      clearSelection();
      refetch();
    } catch { toast.error(t("an_error_occurred")); }
  };

  const handleExportExcel = () =>
    exportToExcel(selectedUsers.map((u) => ({ username: u.username, email: u.email, first_name: u.first_name, last_name: u.last_name })), "utilisateurs");

  const handleExportCsv = () =>
    exportToCsv(selectedUsers.map((u) => ({ username: u.username, email: u.email, first_name: u.first_name, last_name: u.last_name })), "utilisateurs");

  const handleImport = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(USERS_BULK_URL, {
      method: "POST",
      headers: getAuthHeaders(false),
      body: fd,
    });
    return res.json();
  };

  return (
    <div className="p-6 space-y-4">
      <BulkActionBar
        selectedCount={selectedCount}
        onClear={clearSelection}
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
                  <th className="px-3 py-3 w-10 text-left font-medium">
                    <Checkbox checked={isAllSelected} data-state={isIndeterminate ? "indeterminate" : undefined} onCheckedChange={toggleAll} aria-label={t("select_all")} />
                  </th>
                  <SortableHeader label={t("username")} sortKey="username" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={t("email")} sortKey="email" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={t("first_name")} sortKey="first_name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
                  <SortableHeader label={t("last_name")} sortKey="last_name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
                  <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide">{t("is_active")}</th>
                </tr>
              </thead>
              <tbody>
                {displayUsers.map((user: User) => (
                  <tr
                    key={user.id}
                    className={`border-t hover:bg-muted/30 transition-colors cursor-pointer ${isSelected(user.id) ? "bg-primary/5" : ""}`}
                    onClick={() => router.push(`${pathname}/${user.id}`)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={isSelected(user.id)} onCheckedChange={() => toggle(user.id)} aria-label={`Sélectionner ${user.username}`} />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{user.username}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.first_name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.last_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${user.is_active ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-500"}`}>
                        {user.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                  </tr>
                ))}
                {displayUsers.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">{t("no_data")}</td></tr>}
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
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} resourceName="Utilisateurs" templateFields={["username", "email", "first_name", "last_name", "phone_number"]} />
    </div>
  );
};

export default DataSection;
