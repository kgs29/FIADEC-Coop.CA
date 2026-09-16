"use client";
import { BASE_API_URL } from "@/constants/env";
import { useTableSearch } from "@/hooks/useTableSearch";
import { useTableSort } from "@/hooks/useTableSort";
import type { SortDir } from "@/hooks/useTableSort";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, CheckCircle, Mail, Trash2, User } from "lucide-react";
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

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
}

interface PaginatedContacts {
  count: number;
  results: ContactMessage[];
}

const CONTACT_ENDPOINT = "core/contact";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  const parsed = token ? JSON.parse(token) : null;
  return {
    Authorization: parsed ? `Bearer ${parsed}` : "",
    "Content-Type": "application/json",
  };
};

const statusBadge = (status: string, t: (k: string) => string) => {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    read: "bg-gray-100 text-gray-600",
    replied: "bg-emerald-100 text-emerald-700",
  };
  const labelMap: Record<string, string> = {
    new: t("contact_status_new"),
    read: t("contact_status_read"),
    replied: t("contact_status_replied"),
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {labelMap[status] ?? status}
    </span>
  );
};

type ContactsContentPageProps = Readonly<{
  onFiltersChange?: (filterQuery: string) => void;
  externalSearch?: string;
  onCountUpdate?: (info: { total: number; newCount: number } | null) => void;
}>;

const ContactsContentPage = ({ onFiltersChange, externalSearch, onCountUpdate }: ContactsContentPageProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PaginatedContacts | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_API_URL}${CONTACT_ENDPOINT}/list/?page=${page - 1}&size=${pageSize}` + (externalSearch ? `&search=${encodeURIComponent(externalSearch)}` : ""),
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

  const handleStatus = async (id: number, status: string) => {
    try {
      await fetch(`${BASE_API_URL}${CONTACT_ENDPOINT}/${id}/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      await fetchData();
      toast.success(t("updated_successfully"));
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${BASE_API_URL}${CONTACT_ENDPOINT}/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      await fetchData();
      toast.success(t("deleted_successfully"));
    } catch {
      toast.error(t("an_error_occurred"));
    }
  };

  const { filtered, setQuery } = useTableSearch(
    (data?.results ?? []) as unknown as Record<string, unknown>[],
    ["name", "email", "subject", "status"]
  );
  useEffect(() => { setQuery(externalSearch ?? ""); }, [externalSearch, setQuery]);
  useEffect(() => { onFiltersChange?.(""); }, [onFiltersChange]);
  const { sorted, sortKey, sortDir, handleSort } = useTableSort(filtered);
  const displayContacts = sorted as unknown as ContactMessage[];

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

  const newCount = data?.results?.filter((m) => m.status === "new").length ?? 0;

  useEffect(() => {
    onCountUpdate?.(data ? { total: data.count, newCount } : null);
  }, [data, newCount, onCountUpdate]);

  return (
    <div className="rounded-md bg-white m-4 p-6 flex flex-col gap-6">
      {/* Search is rendered above the tabs by StatsTabLayout */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
            {/* Thead */}
            <div className="grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-4 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <SortColHeader label={<span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{t("contact_name")}</span>} sk="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortColHeader label={<span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />Email</span>} sk="email" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortColHeader label={t("contact_subject")} sk="subject" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortColHeader label={<span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{t("create_at")}</span>} sk="created_at" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortColHeader label={t("status")} sk="status" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
            </div>

            {displayContacts.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                {/* Row */}
                <button
                  className="grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-4 px-4 py-3 text-sm text-left hover:bg-gray-50/70 transition-colors"
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                >
                  <span className={`font-medium truncate ${msg.status === "new" ? "text-gray-900" : "text-gray-600"}`}>
                    {msg.status === "new" && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 align-middle" />}
                    {msg.name}
                  </span>
                  <span className="text-gray-500 truncate">{msg.email}</span>
                  <span className="text-gray-700 truncate">{msg.subject}</span>
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  <span>{statusBadge(msg.status, t)}</span>
                </button>

                {/* Expanded detail */}
                {expanded === msg.id && (
                  <div className="bg-blue-50/40 border-t border-blue-100 px-6 py-4 flex flex-col gap-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {msg.status !== "read" && (
                        <button
                          onClick={() => handleStatus(msg.id, "read")}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />{t("contact_mark_read")}
                        </button>
                      )}
                      {msg.status !== "replied" && (
                        <button
                          onClick={() => handleStatus(msg.id, "replied")}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />{t("contact_reply")}
                        </button>
                      )}
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                        onClick={() => handleStatus(msg.id, "replied")}
                      >
                        <Mail className="w-3.5 h-3.5" />Email
                      </a>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />{t("delete")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {displayContacts.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">{t("no_data")}</div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-gray-500 dark:text-white whitespace-nowrap">{t("rows_per_page")}</Label>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
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
                {getPaginationRange().map((p, idx, arr) => {
                  if (p === "ellipsis") {
                    const prevPage = arr.slice(0, idx).reverse().find((x) => x !== "ellipsis") ?? 0;
                    return (
                      <PaginationItem key={`ellipsis-after-${prevPage}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={`page-${p}`}>
                      <PaginationLink
                        isActive={page === p}
                        className={page === p ? "bg-secondary text-white dark:text-white pointer-events-none cursor-default" : "cursor-pointer"}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
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

type SortColHeaderProps = Readonly<{
  label: React.ReactNode;
  sk: string;
  currentKey: string | null;
  currentDir: SortDir;
  onSort: (key: string) => void;
}>;

function SortColHeader({ label, sk, currentKey, currentDir, onSort }: SortColHeaderProps) {
  const active = currentKey === sk;

  let sortIcon: React.ReactNode;
  if (!active) {
    sortIcon = <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-400" />;
  } else if (currentDir === "asc") {
    sortIcon = <ArrowUp className="w-3 h-3 text-primary" />;
  } else {
    sortIcon = <ArrowDown className="w-3 h-3 text-primary" />;
  }

  return (
    <button
      type="button"
      onClick={() => onSort(sk)}
      className="inline-flex items-center gap-1 group select-none hover:text-gray-700 transition-colors text-left"
    >
      {label}
      {sortIcon}
    </button>
  );
}

export default ContactsContentPage;
