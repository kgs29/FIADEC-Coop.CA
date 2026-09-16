"use client";
import { PageDetail } from "@/components/layout/PageDetail";
import ErrorComponent from "@/components/dashboard/ErrorComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PermissionGuard from "@/lib/PermissionGuard";
import UrlGuard from "@/lib/UrlGuard";
import {
  useArchiveADGroupMappingMutation,
  useDeleteADGroupMappingMutation,
  useDuplicateADGroupMappingMutation,
  useGetSingleADGroupMappingQuery,
  useUnarchiveADGroupMappingMutation,
} from "@/store/apis/auth/authentication.api";
import { useNavigateBack } from "@/utils/navigate-back";
import { Archive, ArchiveRestore, Copy, Edit, Loader, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function toApiError(err: FetchBaseQueryError | SerializedError) {
  const status = "status" in err && typeof err.status === "number" ? err.status : undefined;
  const originalStatus = "originalStatus" in err ? (err as FetchBaseQueryError & { originalStatus?: number }).originalStatus : undefined;
  return { status, originalStatus };
}

export default function ADGroupMappingDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const navigateBack = useNavigateBack();

  const { data: mapping, isFetching, error } = useGetSingleADGroupMappingQuery(id);
  const [deleteMapping, { isLoading: deleting }] = useDeleteADGroupMappingMutation();
  const [archiveMapping, { isLoading: archiving }] = useArchiveADGroupMappingMutation();
  const [unarchiveMapping, { isLoading: unarchiving }] = useUnarchiveADGroupMappingMutation();
  const [duplicateMapping, { isLoading: duplicating }] = useDuplicateADGroupMappingMutation();

  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try { await deleteMapping(id).unwrap(); toast.success(t("deleted_successfully")); navigateBack(); }
    catch { toast.error(t("an_error_occurred")); }
    finally { setOpenDelete(false); }
  };

  const handleArchiveToggle = async () => {
    try {
      if (mapping?.is_archived) {
        await unarchiveMapping(id).unwrap();
        toast.success(t("unarchived_successfully"));
      } else {
        await archiveMapping(id).unwrap();
        toast.success(t("archived_successfully"));
      }
    } catch { toast.error(t("an_error_occurred")); }
  };

  const handleDuplicate = async () => {
    try { await duplicateMapping(id).unwrap(); toast.success(t("duplicated_successfully")); router.push("/admin/administration/ad-group-mappings"); }
    catch { toast.error(t("an_error_occurred")); }
  };

  if (isFetching) return <div className="flex justify-center h-60 items-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <ErrorComponent error={toApiError(error)} />;
  if (!mapping) return null;

  return (
    <UrlGuard permission="view_adgroupmapping">
      <PageDetail
        itemName={mapping.ad_group_name}
        onBack={navigateBack}
        historyModelName="adgroupmapping"
        historyObjectId={id as string}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 btn-action" title={t("actions")}>
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t("actions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <PermissionGuard permission="change_adgroupmapping">
                <DropdownMenuItem onClick={handleArchiveToggle} disabled={archiving || unarchiving} className="gap-2 cursor-pointer">
                  {mapping.is_archived ? <ArchiveRestore className="h-4 w-4 text-green-500" /> : <Archive className="h-4 w-4 text-orange-500" />}
                  {mapping.is_archived ? t("unarchive") : t("archive")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href={`${pathname}/edit`}>
                    <Edit className="h-4 w-4 text-blue-500" /> {t("edit")}
                  </Link>
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="add_adgroupmapping">
                <DropdownMenuItem onClick={handleDuplicate} disabled={duplicating} className="gap-2 cursor-pointer">
                  <Copy className="h-4 w-4 text-violet-500" /> {t("duplicate")}
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="delete_adgroupmapping">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenDelete(true)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="h-4 w-4" /> {t("delete")}
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {/* Card */}
        <div className="shadow-lg p-6 rounded-lg space-y-6 bg-card">
          <div className="flex items-center gap-4 px-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xl">AD</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold font-mono text-gray-900">{mapping.ad_group_name}</span>
                {mapping.is_archived && <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">{t("archived")}</Badge>}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{t("ad_group_name")}</p>
            </div>
          </div>
          <Separator />
          <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-400">{t("ad_group_name")}</Label>
              <span className="font-mono text-sm text-gray-800">{mapping.ad_group_name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-400">{t("role")}</Label>
              <Badge className="w-fit bg-green-100 text-green-700 text-sm font-medium">{mapping.role_name}</Badge>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-gray-400">{t("status")}</Label>
              <span className={`text-sm font-medium ${mapping.is_archived ? "text-orange-600" : "text-green-600"}`}>
                {mapping.is_archived ? t("archived") : t("active")}
              </span>
            </div>
          </div>
        </div>

      </PageDetail>

      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={mapping?.ad_group_name}
      />
    </UrlGuard>
  );
}
