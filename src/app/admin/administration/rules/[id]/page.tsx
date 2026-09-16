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
  useDeleteRuleMutation,
  useDuplicateRuleMutation,
  useGetSingleRuleQuery,
} from "@/store/apis/auth/authentication.api";
import { normalizeRtkError } from "@/lib/normalizeRtkError";
import { useNavigateBack } from "@/utils/navigate-back";
import { Copy, Edit, Loader, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function RuleDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const navigateBack = useNavigateBack();

  const { data: rule, isFetching, error } = useGetSingleRuleQuery(id);
  const [deleteRule, { isLoading: deleting }] = useDeleteRuleMutation();
  const [duplicateRule, { isLoading: duplicating }] = useDuplicateRuleMutation();

  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try { await deleteRule(id).unwrap(); toast.success(t("deleted_successfully")); navigateBack(); }
    catch { toast.error(t("an_error_occurred")); }
    finally { setOpenDelete(false); }
  };

  const handleDuplicate = async () => {
    try { await duplicateRule(id).unwrap(); toast.success(t("duplicated_successfully")); router.push("/admin/administration/rules"); }
    catch { toast.error(t("an_error_occurred")); }
  };

  if (isFetching) return <div className="flex justify-center h-60 items-center"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return <ErrorComponent error={normalizeRtkError(error)} />;
  if (!rule) return null;

  return (
    <UrlGuard permission="view_group">
      <PageDetail
        itemName={rule.name}
        onBack={navigateBack}
        historyModelName="group"
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
              <PermissionGuard permission="change_group">
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
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
              {rule.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xl font-semibold text-gray-900">{rule.name}</span>
              <p className="text-sm text-gray-500 mt-0.5">{rule.permissions?.length ?? 0} {t("permissions")}</p>
            </div>
          </div>
          <Separator />
          <div className="px-4 space-y-3">
            <span className="font-semibold text-sm">{t("permissions")}</span>
            {!rule.permissions || rule.permissions.length === 0 ? (
              <p className="text-sm text-gray-400">{t("no_data")}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {rule.permissions.map((p) => (
                  <Badge key={p.codename} variant="outline" className="text-xs">{p.codename}</Badge>
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
        itemName={rule?.name}
      />
    </UrlGuard>
  );
}
