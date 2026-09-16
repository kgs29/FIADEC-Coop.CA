"use client";

import UrlGuard from "@/lib/UrlGuard";
import { StatsTabLayout } from "@/components/StatsTabLayout";
import PaymentsStats from "./PaymentsStats";
import {
  useGetAllPaymentsQuery,
} from "@/store/apis/payment/payment.api";
import { PaymentStatusType } from "@/types/payment.types";
import {
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback, useEffect, useRef, useState } from "react";

const STATUS_STYLE: Record<PaymentStatusType, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: "🏦 Virement",
  paypal: "💳 PayPal",
  orange_money: "🟠 Orange Money",
  mtn_money: "🟡 MTN MoMo",
};

type PaiementsTableProps = Readonly<{
  onFiltersChange?: (q: string) => void;
  externalSearch?: string;
  onCountUpdate?: (count: number | null) => void;
  onRefetchReady?: (fn: () => void) => void;
  statusFilter?: string;
  methodFilter?: string;
}>;

function PaiementsTable({ onFiltersChange, externalSearch, onCountUpdate, onRefetchReady, statusFilter = "", methodFilter = "" }: PaiementsTableProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const params = [
    `page=${page - 1}`,
    `size=${pageSize}`,
    externalSearch ? `search=${encodeURIComponent(externalSearch)}` : "",
    statusFilter ? `status__exact=${statusFilter}` : "",
    methodFilter ? `payment_method__exact=${methodFilter}` : "",
  ]
    .filter(Boolean)
    .join("&");

  // Notifie le parent des filtres actifs (sans search - géré par StatsTabLayout)
  useEffect(() => {
    const filterParts = [
      statusFilter ? `status__exact=${statusFilter}` : "",
      methodFilter ? `payment_method__exact=${methodFilter}` : "",
    ].filter(Boolean);
    onFiltersChange?.(filterParts.join("&"));
  }, [statusFilter, methodFilter, onFiltersChange]);

  const router = useRouter();
  const { data, isFetching, refetch } = useGetAllPaymentsQuery(params);
  useEffect(() => { onCountUpdate?.(data?.count ?? null); }, [data?.count, onCountUpdate]);

  // `refetch` is read through a ref so this effect only depends on `onRefetchReady`
  // (stable via useCallback in the parent) instead of `refetch`'s identity - otherwise
  // a `refetch` reference that changes every render (as some mocks/hooks may) would
  // re-fire this effect and the parent's setState on every commit, looping forever.
  const refetchRef = useRef(refetch);
  useEffect(() => { refetchRef.current = refetch; }, [refetch]);
  useEffect(() => {
    onRefetchReady?.(() => refetchRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefetchReady]);

  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;

  const getPaginationRange = (): (number | "ellipsis")[] => {
    const delta = 2;
    const range: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) range.push(i);
      else if (range.at(-1) !== "ellipsis") range.push("ellipsis");
    }
    return range;
  };


  return (
    <div className="p-6 space-y-6">
      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {[t("reference"), t("user"), t("payment_amount"), t("payment_method_label"), t("status"), t("date"), t("actions")].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isFetching && !data && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    {t("loading")}
                  </td>
                </tr>
              )}
              {!isFetching && !data?.results?.length && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    {t("no_payment_found")}
                  </td>
                </tr>
              )}
              {data?.results?.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/paiements/${p.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter") router.push(`/admin/paiements/${p.id}`); }}
                  tabIndex={0}
                  role="row"
                >
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{p.reference}</td>
                  <td className="px-4 py-3 text-foreground">
                    <div className="font-medium">{p.user_username ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.user_email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                    {Number(p.amount).toLocaleString("fr-FR")} {p.currency}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {METHOD_LABEL[p.payment_method] ?? p.payment_method_display}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[p.status]}`}>
                      {p.status_display}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground dark:text-white whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-border">
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground dark:text-white whitespace-nowrap">{t("rows_per_page")}</Label>
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[10, 15, 25, 50, 100].map((n) => (<SelectItem key={n} value={n.toString()}>{n}</SelectItem>))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} onClick={() => setPage((p) => Math.max(1, p - 1))} />
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
                    <PaginationLink isActive={page === p} className={page === p ? "bg-secondary text-white dark:text-white pointer-events-none cursor-default" : "cursor-pointer"} onClick={() => setPage(p)}>{p}</PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default function PaiementsAdminPage() {
  const { t } = useTranslation();
  const [count, setCount] = useState<number | null>(null);
  const [refetchFn, setRefetchFn] = useState<(() => void) | null>(null);
  const [isFetchingExt, setIsFetchingExt] = useState(false);
  const fetchingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const handleRefetch = useCallback(() => {
    setIsFetchingExt(true);
    refetchFn?.();
    if (fetchingTimerRef.current) clearTimeout(fetchingTimerRef.current);
    fetchingTimerRef.current = setTimeout(() => setIsFetchingExt(false), 800);
  }, [refetchFn]);

  // Stable reference: an inline arrow here would be recreated every render,
  // re-running PaiementsTable's onRefetchReady effect (which calls setRefetchFn)
  // on every commit and causing an infinite render loop.
  const handleRefetchReady = useCallback((fn: () => void) => setRefetchFn(() => fn), []);

  useEffect(() => () => {
    if (fetchingTimerRef.current) clearTimeout(fetchingTimerRef.current);
  }, []);

  const selectCls = "text-xs sm:text-sm border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary max-w-[130px] sm:max-w-none";

  return (
    <UrlGuard permission="add_logentry">
      <StatsTabLayout
        statsPanel={<PaymentsStats />}
        aboveSearch={
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("paymentList") ?? "Paiements en ligne"}</h1>
              {count !== null && (
                <p className="text-sm text-muted-foreground">
                  {count} {t("paymentPage") ?? "paiement(s)"}
                </p>
              )}
            </div>
          </div>
        }
        headerRight={
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectCls}
            >
              <option value="">{t("all_statuses")}</option>
              <option value="pending">{t("status_pending")}</option>
              <option value="processing">{t("status_processing")}</option>
              <option value="completed">{t("status_completed")}</option>
              <option value="failed">{t("status_failed")}</option>
              <option value="cancelled">{t("status_cancelled")}</option>
              <option value="refunded">{t("status_refunded")}</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className={selectCls}
            >
              <option value="">{t("all_methods")}</option>
              <option value="bank_transfer">{t("method_bank_transfer")}</option>
              <option value="paypal">PayPal</option>
              <option value="orange_money">Orange Money</option>
              <option value="mtn_money">MTN MoMo</option>
            </select>
            <button
              onClick={handleRefetch}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
              title={t("refresh")}
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isFetchingExt ? "animate-spin" : ""}`} />
            </button>
          </>
        }
      >
        <PaiementsTable
          statusFilter={statusFilter}
          methodFilter={methodFilter}
          onCountUpdate={setCount}
          onRefetchReady={handleRefetchReady}
        />
      </StatsTabLayout>
    </UrlGuard>
  );
}
