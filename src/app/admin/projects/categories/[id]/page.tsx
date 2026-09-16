"use client";
import { PageDetail } from "@/components/layout/PageDetail";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PermissionGuard from "@/lib/PermissionGuard";
import UrlGuard from "@/lib/UrlGuard";
import {
  useArchiveProjectCategoryMutation,
  useDeleteProjectCategoryMutation,
  useDuplicateProjectCategoryMutation,
  useGetProjectCategoryQuery,
} from "@/store/apis/core/project.api";
import { useNavigateBack } from "@/utils/navigate-back";
import { Archive, Copy, Pencil, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ProjectCategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const navigateBack = useNavigateBack();
  const { t } = useTranslation();

  const { data: category, isLoading } = useGetProjectCategoryQuery(id);
  const [archiveCategory, { isLoading: archiving }] = useArchiveProjectCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteProjectCategoryMutation();
  const [duplicateCategory, { isLoading: duplicating }] = useDuplicateProjectCategoryMutation();

  const [openDelete, setOpenDelete] = useState(false);

  const handleArchive = async () => {
    try { await archiveCategory(id).unwrap(); toast.success(t("archived_successfully")); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleDuplicate = async () => {
    try { await duplicateCategory(id).unwrap(); toast.success(t("duplicated_successfully")); router.push("/admin/projects/categories"); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleDelete = async () => {
    try { await deleteCategory(id).unwrap(); toast.success(t("deleted_successfully")); navigateBack(); }
    catch { toast.error(t("an_error_occurred")); }
    finally { setOpenDelete(false); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!category) return null;

  return (
    <UrlGuard permission="view_projectcategory">
      <>
        <PageDetail
        itemName={category.name}
        onBack={navigateBack}
        historyModelName="projectcategory"
        historyObjectId={id}
        className="bg-card p-7 mt-6 max-w-2xl mx-auto space-y-8"
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 btn-action" title={t("actions")}>
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t("actions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <PermissionGuard permission="change_projectcategory">
                <DropdownMenuItem onClick={handleArchive} disabled={archiving} className="gap-2 cursor-pointer">
                  <Archive className="h-4 w-4 text-orange-500" /> {t("archive")}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href={`${pathname}/edit`}>
                    <Pencil className="h-4 w-4 text-blue-500" /> {t("edit")}
                  </Link>
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="add_projectcategory">
                <DropdownMenuItem onClick={handleDuplicate} disabled={duplicating} className="gap-2 cursor-pointer">
                  <Copy className="h-4 w-4 text-violet-500" /> {t("duplicate")}
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="delete_projectcategory">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenDelete(true)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="h-4 w-4" /> {t("delete")}
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <div className="space-y-4 shadow-lg p-6 rounded-lg bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {category.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>
              {category.slug && <p className="text-xs text-gray-400 font-mono">{category.slug}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 w-24">{t("status")}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {category.is_active ? t("active") : t("inactive")}
            </span>
          </div>
          {category.description && (
            <div>
              <span className="text-sm text-gray-500 block mb-1">{t("description")}</span>
              <p className="text-gray-700 text-sm leading-relaxed">{category.description}</p>
            </div>
          )}
        </div>

      </PageDetail>

        <DeleteConfirmDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          onConfirm={handleDelete}
          loading={deleting}
          itemName={category?.name}
        />
      </>
    </UrlGuard>
  );
};

export default ProjectCategoryDetailPage;
