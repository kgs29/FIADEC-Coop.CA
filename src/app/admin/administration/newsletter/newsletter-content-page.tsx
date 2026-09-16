"use client";
import { BASE_API_URL } from "@/constants/env";
import { SortableHeader } from "@/components/SortableHeader";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSort } from "@/hooks/useTableSort";
import { Calendar, Mail, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
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

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

interface PaginatedSubscribers {
  count: number;
  results: Subscriber[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  const parsed = token ? JSON.parse(token) : null;
  return { Authorization: parsed ? `Bearer ${parsed}` : "" };
};

interface NewsletterContentPageProps {
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
  onCountUpdate?: (info: { total: number; active: number } | null) => void;
}

const NewsletterContentPage = ({ onFiltersChange, externalSearch, onCountUpdate }: NewsletterContentPageProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PaginatedSubscribers | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_API_URL}core/newsletter/?page=${page - 1}&size=${pageSize}` + (externalSearch ? `&search=${encodeURIComponent(externalSearch)}` : ""),
        { headers: getAuthHeaders(), signal }
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setData(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => { setPage(1); }, [externalSearch]);
  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, externalSearch]);

  const handleToggle = async (subscriber: Subscriber) => {
    try {
      await fetch(`${BASE_API_URL}core/newsletter/${subscriber.id}/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      await fetchData();
      toast.success(t("updated_successfully"));
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${BASE_API_URL}core/newsletter/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      await fetchData();
      toast.success(t("deleted_successfully"));
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

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

  const { filtered, setQuery } = useTableSearch(
    (data?.results ?? []) as unknown as Record<string, unknown>[],
    ["email"]
  );
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(""); }, [onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displaySubs = sorted as unknown as Subscriber[];

  const activeCount = data?.results?.filter((s) => s.is_active).length ?? 0;

  useEffect(() => {
    onCountUpdate?.(data ? { total: data.count, active: activeCount } : null);
  }, [data, activeCount, onCountUpdate]);

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
                  <SortableHeader label={<span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{t("email")}</span>} sortKey="email" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={<span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{t("create_at")}</span>} sortKey="subscribed_at" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHeader label={t("status")} sortKey="is_active" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <th className="text-left px-4 py-3 font-medium text-gray-500">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displaySubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{sub.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(sub.subscribed_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sub.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {sub.is_active ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(sub)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
                          title={sub.is_active ? t("lock") : t("unlock")}
                        >
                          {sub.is_active
                            ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                            : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displaySubs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-400">
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

export default NewsletterContentPage;
