"use client";
import { BASE_API_URL } from "@/constants/env";
import { SortableHeader } from "@/components/SortableHeader";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSort } from "@/hooks/useTableSort";
import { Clock, Globe, Hash, Monitor, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ConnectionLog {
  id: number;
  username: string;
  timestamp: string;
  ip_address: string;
  endpoint: string;
  method: string;
  status_code: number;
  user_agent: string;
  duration_ms: number;
}

interface PaginatedLogs {
  count: number;
  results: ConnectionLog[];
}

const statusColor = (code: number) => {
  if (code < 300) return "bg-emerald-100 text-emerald-700";
  if (code < 400) return "bg-blue-100 text-blue-700";
  if (code < 500) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const methodColor = (method: string) => {
  const m = method.toUpperCase();
  if (m === "GET") return "bg-sky-100 text-sky-700";
  if (m === "POST") return "bg-emerald-100 text-emerald-700";
  if (m === "PUT" || m === "PATCH") return "bg-orange-100 text-orange-700";
  if (m === "DELETE") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

interface LogsContentPageProps {
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
  onCountUpdate?: (count: number | null) => void;
}

const LogsContentPage = ({ onFiltersChange, externalSearch, onCountUpdate }: LogsContentPageProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PaginatedLogs | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access");
        const parsed = token ? JSON.parse(token) : null;
        const res = await fetch(
          `${BASE_API_URL}auth/connection-logs/?page=${page - 1}&size=${pageSize}` + (externalSearch ? `&search=${encodeURIComponent(externalSearch)}` : ""),
          {
            headers: {
              Authorization: parsed ? `Bearer ${parsed}` : "",
            },
          }
        );
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, pageSize, externalSearch]);

  useEffect(() => { setPage(1); }, [externalSearch]);

  useEffect(() => { onCountUpdate?.(data?.count ?? null); }, [data?.count, onCountUpdate]);

  const { filtered, setQuery } = useTableSearch(
    (data?.results ?? []) as unknown as Record<string, unknown>[],
    ["username", "endpoint", "ip_address", "method"]
  );
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(""); }, [onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displayLogs = sorted as unknown as ConnectionLog[];

  const totalPages = data ? Math.ceil(data.count / pageSize) : 1;

  const getPaginationRange = (): (number | "ellipsis")[] => {
    const delta = 2;
    const range: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      } else if (range.at(-1) !== "ellipsis") {
        range.push("ellipsis");
      }
    }
    return range;
  };

  return (
    <div className="rounded-md bg-white m-4 p-6 flex flex-col gap-6">
      {/* Search is rendered above the tabs by StatsTabLayout */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <SortableHeader label={<span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t("timestamp")}</span>} sortKey="timestamp" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={<span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{t("username")}</span>} sortKey="username" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={<span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{t("url")}</span>} sortKey="endpoint" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={t("method")} sortKey="method" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={t("status")} sortKey="status_code" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={<span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5" />{t("duration")}</span>} sortKey="duration_ms" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={<span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5" />IP</span>} sortKey="ip_address" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-white whitespace-nowrap text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                      {log.username || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate" title={log.endpoint}>
                      {log.endpoint}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${methodColor(log.method)}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColor(log.status_code)}`}>
                        {log.status_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {log.duration_ms} ms
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
                {displayLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      {t("no_data")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-gray-500 dark:text-white whitespace-nowrap">{t("rows_per_page")}</Label>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[10, 25, 50, 100].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {(() => {
                  let ec = 0;
                  return getPaginationRange().map((p) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${++ec}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${p}`}>
                        <PaginationLink
                          isActive={page === p}
                          className={page === p ? "bg-secondary text-white dark:text-white pointer-events-none cursor-default" : "cursor-pointer"}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  );
                })()}
                <PaginationItem>
                  <PaginationNext
                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default LogsContentPage;
