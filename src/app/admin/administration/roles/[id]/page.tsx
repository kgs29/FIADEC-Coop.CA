"use client";
import { PageDetail } from "@/components/layout/PageDetail";
import ErrorComponent from "@/components/dashboard/ErrorComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import PermissionGuard from "@/lib/PermissionGuard";
import UrlGuard from "@/lib/UrlGuard";
import {
  useArchiveRoleMutation,
  useDeleteRoleMutation,
  useDuplicateRoleMutation,
  useGetSingleRoleQuery,
  useUnarchiveRoleMutation,
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

export default function RoleDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const navigateBack = useNavigateBack();

  const { data: role, isFetching, error } = useGetSingleRoleQuery(id);
  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();
  const [archiveRole, { isLoading: archiving }] = useArchiveRoleMutation();
  const [unarchiveRole, { isLoading: unarchiving }] = useUnarchiveRoleMutation();
  const [duplicateRole, { isLoading: duplicating }] = useDuplicateRoleMutation();

  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try { await deleteRole(id).unwrap(); toast.success(t("deleted_successfully")); navigateBack(); }
    catch { toast.error(t("an_error_occurred")); }
    finally { setOpenDelete(false); }
  };

  const handleArchiveToggle = async () => {
    try {
      if (role?.is_archived) {
        await unarchiveRole(id).unwrap();
        toast.success(t("unarchived_successfully"));
      } else {
        await archiveRole(id).unwrap();
        toast.success(t("archived_successfully"));
      }
    } catch { toast.error(t("an_error_occurred")); }
  };

  const handleDuplicate = async () => {
    try { await duplicateRole(id).unwrap(); toast.success(t("duplicated_successfully")); router.push("/admin/administration/roles"); }
    catch { toast.error(t("an_error_occurred")); }
  };

  if (isFetching) return <div className="flex justify-center h-60 items-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <ErrorComponent error={toApiError(error)} />;
  if (!role) return null;

  return (
    <UrlGuard permission="view_group">
      <PageDetail
        itemName={role.name}
        onBack={navigateBack}
        historyModelName="role"
        historyObjectId={id}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 btn-action" title={t("actions")}>
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t("actions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <PermissionGuard permission="change_group">
                <DropdownMenuItem onClick={handleArchiveToggle} disabled={archiving || unarchiving} className="gap-2 cursor-pointer">
                  {role.is_archived ? <ArchiveRestore className="h-4 w-4 text-green-500" /> : <Archive className="h-4 w-4 text-orange-500" />}
                  {role.is_archived ? t("unarchive") : t("archive")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href={`${pathname}/edit`}>
                    <Edit className="h-4 w-4 text-blue-500" /> {t("edit")}
                  </Link>
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="add_group">
                <DropdownMenuItem onClick={handleDuplicate} disabled={duplicating} className="gap-2 cursor-pointer">
                  <Copy className="h-4 w-4 text-violet-500" /> {t("duplicate")}
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="delete_group">
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
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {role.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-gray-900">{role.name}</span>
                {role.is_archived && <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">{t("archived")}</Badge>}
              </div>
              <span className="text-sm text-gray-500">{role.users_count} {t("users")}</span>
            </div>
          </div>
          <Separator />
          <div className="px-4 space-y-3">
            <span className="font-semibold text-sm">{t("groups_selection")}</span>
            {role.groups.length === 0 ? (
              <p className="text-sm text-gray-400">{t("no_groups")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {role.groups.map((g) => (
                  <div key={g.id} className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-800">{g.name}</p>
                    {g.permissions && g.permissions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {g.permissions.slice(0, 4).map((p) => (
                          <Badge key={p.codename} variant="outline" className="text-xs">{p.codename}</Badge>
                        ))}
                        {g.permissions.length > 4 && <Badge variant="outline" className="text-xs">+{g.permissions.length - 4}</Badge>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </PageDetail>

      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={role?.name}
      />
    </UrlGuard>
  );
}
