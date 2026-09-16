"use client";
import { AuditTimeline } from "@/components/AuditTimeline";
import { PageDetail } from "@/components/layout/PageDetail";
import ErrorComponent from "@/components/dashboard/ErrorComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-btn";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import PermissionGuard from "@/lib/PermissionGuard";
import UrlGuard from "@/lib/UrlGuard";
import {
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useSetUserStatusMutation,
} from "@/store/apis/auth/authentication.api";
import { User } from "@/types/auth.types";
import { normalizeRtkError } from "@/lib/normalizeRtkError";
import { useNavigateBack } from "@/utils/navigate-back";
import { Edit, Loader, Settings, Trash2, X } from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function UserDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const pathname = usePathname();
  const navigateBack = useNavigateBack();

  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [openSetUserStatusModal, setOpenSetUserStatusModal] = useState(false);

  const [setUserStatus, { isLoading: isLoadingSetUserStatus }] = useSetUserStatusMutation();
  const { data: user, isFetching, error } = useGetSingleUserQuery(id as string);
  const properties: User = useMemo(() => (user ?? {}) as User, [user]);
  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  const handleDeleteUser = async () => {
    try {
      await deleteUser(id as string).unwrap();
      toast.success(t("user_deleted_successfully"));
      navigateBack();
    } catch (err: any) {
      const msg = err?.data?.error?.message;
      toast.error(msg ?? t("an_error_occurred"));
    } finally {
      setOpenDeleteUserModal(false);
    }
  };

  const handleChangeUserStatus = async () => {
    try {
      await setUserStatus(properties.id).unwrap();
      toast.success(t("status_updated_successfully"));
      setOpenSetUserStatusModal(false);
    } catch {
      toast.error(t("failed_update_user_status"));
    }
  };

  if (isFetching) {
    return <div className="flex items-center justify-center h-[600px]"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) return <ErrorComponent error={normalizeRtkError(error)} />;

  return (
    <UrlGuard permission="view_user">
      <PageDetail
        itemName={properties?.username || ""}
        onBack={navigateBack}
        historyModelName="user"
        historyObjectId={id as string}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 btn-action" title={t("actions")}>
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t("actions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <PermissionGuard permission="change_user">
                <DropdownMenuItem onClick={() => setOpenSetUserStatusModal(true)} className="gap-2 cursor-pointer">
                  <Switch checked={properties.is_active} className="scale-75 pointer-events-none" />
                  {properties.is_active ? t("lock") : t("unlock")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href={`${pathname}/edit`}>
                    <Edit className="h-4 w-4 text-blue-500" /> {t("edit")}
                  </Link>
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="delete_user">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenDeleteUserModal(true)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="h-4 w-4" /> {t("delete")}
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {/* Card */}
        <div className="shadow-lg p-6 rounded-lg">
          <div className="rounded-xl p-6 px-10 flex items-center gap-4">
            <div className="flex relative items-end max-w-max">
              <Avatar className="size-20 ring-2 ring-gray-500 ring-offset-2">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marie" alt={properties?.username} />
                <AvatarFallback className="bg-gray-600 text-white font-semibold text-lg">
                  {`${properties?.username ?? ""} ${properties?.first_name ?? ""} ${properties?.last_name ?? ""}`
                    .split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="bg-primary ring-2 ring-white absolute rounded-full size-3 flex right-0 bottom-2" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="uppercase font-semibold">{properties?.username}</Label>
              <div className="flex flex-wrap gap-1">
                {properties?.roles?.length > 0 ? (
                  properties.roles.map((r) => <Badge key={r.id} variant="default" className="text-xs">{r.name}</Badge>)
                ) : (
                  <Badge variant="secondary" className="text-xs">{t("no_role_assigned")}</Badge>
                )}
              </div>
              <Label className="text-muted-foreground">{properties?.email}</Label>
            </div>
          </div>

          <div className="rounded-xl p-6 px-10 flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2"><Label className="font-semibold">{t("personalInformation")}</Label><Separator /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
              {[
                { label: t("username"), value: properties?.username },
                { label: t("last_name"), value: properties?.last_name },
                { label: t("first_name"), value: properties?.first_name },
                { label: t("phone_number"), value: properties?.phone_number },
                { label: t("email"), value: properties?.email },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <Label className="text-muted-foreground text-xs">{label}</Label>
                  <Label className="text-black">{value}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-6 px-10 flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2"><Label className="font-semibold">{t("user_roles")}</Label><Separator /></div>
            {properties?.roles?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4">
                {properties.roles.map((role) => (
                  <div key={role.id} className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium">{role.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {role.groups.map((g) => <Badge key={g.id} variant="outline" className="text-xs">{g.name}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground px-4">{t("no_role_assigned")}</p>
            )}
          </div>

          <div className="rounded-xl p-6 px-10 flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2"><Label className="font-semibold">{t("otherInformation")}</Label><Separator /></div>
            <div className="flex items-center gap-2 px-4">
              <Switch checked={properties?.is_active} disabled />
              <Label>{properties?.is_active ? t("active") : t("inactive")}</Label>
            </div>
          </div>
        </div>

        {/* History from user model + activity log */}
        {properties.history_datas && properties.history_datas.length > 0 && (
          <div className="shadow-lg p-4 rounded-lg bg-card mt-8">
            <AuditTimeline auditLog={properties.history_datas} />
          </div>
        )}
      </PageDetail>

      <DeleteConfirmDialog
        open={openDeleteUserModal}
        onOpenChange={setOpenDeleteUserModal}
        onConfirm={handleDeleteUser}
        loading={isLoadingDelete}
        itemName={properties?.username}
      />

      <Dialog open={openSetUserStatusModal} onOpenChange={setOpenSetUserStatusModal}>
        <DialogContent showCloseButton={false}>
          <DialogTitle>{t("change_status")}</DialogTitle>
          <DialogDescription>{t("do_you_really_want_to_change_status")}</DialogDescription>
          <div className="flex justify-center gap-x-4">
            <Button size="lg" onClick={() => setOpenSetUserStatusModal(false)} variant="link"><X className="h-4 w-4 shrink-0" /><span className="hidden sm:inline">{t("cancel")}</span></Button>
            <LoadingButton onClick={handleChangeUserStatus} loading={isLoadingSetUserStatus} variant={properties.is_active ? "destructive" : "default"}>
              {properties.is_active ? t("lock") : t("unlock")}
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </UrlGuard>
  );
}
