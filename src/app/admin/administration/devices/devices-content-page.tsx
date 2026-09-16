"use client";
import { useGetDevicesQuery, useRevokeDeviceMutation, UserDevice } from "@/store/apis/auth/authentication.api";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const fmt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const statusBadge = (isActive: boolean) =>
  isActive ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-500";

interface DevicesContentPageProps {
  onFiltersChange?: (filterQuery: string) => void;
  onCountUpdate?: (count: number | null) => void;
}

const DevicesContentPage = ({ onFiltersChange, onCountUpdate }: DevicesContentPageProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const query = `page=${page - 1}&size=${pageSize}`;

  useEffect(() => { onFiltersChange?.(""); }, [onFiltersChange]);
  const { data, isLoading, isFetching, refetch } = useGetDevicesQuery(query);
  useEffect(() => { onCountUpdate?.(data?.count ?? null); }, [data?.count, onCountUpdate]);
  const [revokeDevice, { isLoading: revoking }] = useRevokeDeviceMutation();

  const [pendingDevice, setPendingDevice] = useState<UserDevice | null>(null);

  const handleRevoke = async () => {
    if (!pendingDevice) return;
    await revokeDevice(pendingDevice.id);
    setPendingDevice(null);
    refetch();
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

  return (
    <div className="p-6 space-y-4">
      {/* ── Confirmation modal ── */}
      <AlertDialog open={!!pendingDevice} onOpenChange={(open) => { if (!open) setPendingDevice(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-500" />
              {t("force_logout_device")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Confirmer la déconnexion forcée de l&apos;appareil de{" "}
                  <span className="font-semibold text-foreground">{pendingDevice?.username}</span>&nbsp;?
                  La session sera immédiatement invalidée.
                </p>
                {pendingDevice && (
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground truncate">{pendingDevice.user_agent || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono">{pendingDevice.ip_address ?? "IP inconnue"}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Connecté le {fmt(pendingDevice.created_at)}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={revoking}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
            >
              {revoking ? t("disconnecting") : t("disconnect")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Tableau ── */}
      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{t("user")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("ip_address")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("device")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("login_time")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("logout_time")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("status")}</th>
              <th className="px-4 py-3 text-left font-medium">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {(isLoading || isFetching) && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    {t("loading")}
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !isFetching && (!data || data.results.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  {t("no_device_registered")}
                </td>
              </tr>
            )}
            {!isLoading && !isFetching && data && data.results.length > 0 && (
              <>
                {data.results.map((device) => (
                  <tr key={device.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{device.username}</td>
                    <td className="px-4 py-3 font-mono text-xs">{device.ip_address ?? "—"}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span
                        className="flex items-center gap-1 text-xs text-muted-foreground truncate"
                        title={device.user_agent}
                      >
                        <Smartphone className="w-3 h-3 shrink-0" />
                        <span className="truncate">{device.user_agent || "—"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{fmt(device.created_at)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {device.is_active ? (
                        <span className="text-muted-foreground italic">{t("active_session")}</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs">
                          <LogOut className="w-3 h-3 text-gray-400" />
                          {fmt(device.disconnected_at)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(device.is_active)}`}>
                        {device.is_active ? `● ${t("active")}` : `○ ${t("inactive")}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {device.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs gap-1"
                          onClick={() => setPendingDevice(device)}
                          disabled={revoking}
                          title={t("force_logout_device")}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {t("disconnect")}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Bas de tableau : lignes par page + pagination ── */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Label className="text-sm text-gray-500 dark:text-white whitespace-nowrap">{t("rows_per_page")}</Label>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50, 100].map((n) => (
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {(() => {
              let ec = 0;
              return getPaginationRange().map((p) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${++ec}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default DevicesContentPage;
