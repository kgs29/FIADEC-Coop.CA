"use client";
import { PageDetail } from "@/components/layout/PageDetail";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PermissionGuard from "@/lib/PermissionGuard";
import UrlGuard from "@/lib/UrlGuard";
import {
  useArchiveProjectMutation,
  useDeleteProjectMutation,
  useDuplicateProjectMutation,
  useGetProjectQuery,
  usePublishProjectMutation,
} from "@/store/apis/core/project.api";
import { Code2, Copy, DollarSign, Globe, GlobeLock, Archive, Pencil, Settings, Trash2, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigateBack } from "@/utils/navigate-back";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", expert: "Expert",
};

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const navigateBack = useNavigateBack();
  const { t } = useTranslation();

  const { data: project, isLoading } = useGetProjectQuery(id);
  const [publishProject] = usePublishProjectMutation();
  const [archiveProject, { isLoading: archiving }] = useArchiveProjectMutation();
  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation();
  const [duplicateProject, { isLoading: duplicating }] = useDuplicateProjectMutation();
  const [openDelete, setOpenDelete] = useState(false);

  const handlePublish = async () => {
    try { await publishProject(id).unwrap(); toast.success(t("updated_successfully")); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleArchive = async () => {
    try { await archiveProject(id).unwrap(); toast.success(t("archived_successfully")); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleDuplicate = async () => {
    try { await duplicateProject(id).unwrap(); toast.success(t("duplicated_successfully")); router.push("/admin/projects"); }
    catch { toast.error(t("an_error_occurred")); }
  };

  const handleDelete = async () => {
    try { await deleteProject(id).unwrap(); toast.success(t("deleted_successfully")); navigateBack(); }
    catch { toast.error(t("an_error_occurred")); }
    finally { setOpenDelete(false); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!project) return null;

  return (
    <UrlGuard permission="view_project">
        <PageDetail
          itemName={project.title}
          onBack={navigateBack}
          historyModelName="project"
          historyObjectId={id}
          className="bg-card p-7 mt-6 max-w-4xl mx-auto space-y-8"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1.5 btn-action">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("actions")}</span>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <PermissionGuard permission="change_project">
                <DropdownMenuItem onClick={handleArchive} disabled={archiving} className="gap-2 cursor-pointer">
                  <Archive className="h-4 w-4 text-orange-500" />
                  {project.status === "archived" ? t("unarchive") : t("archive")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePublish} className="gap-2 cursor-pointer">
                  {project.status === "published"
                    ? <GlobeLock className="h-4 w-4 text-yellow-500" />
                    : <Globe className="h-4 w-4 text-green-500" />}
                  {project.status === "published" ? "Dépublier" : "Publier"}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href={`${pathname}/edit`}>
                    <Pencil className="h-4 w-4 text-blue-500" /> {t("edit")}
                  </Link>
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="add_project">
                <DropdownMenuItem onClick={handleDuplicate} disabled={duplicating} className="gap-2 cursor-pointer">
                  <Copy className="h-4 w-4 text-violet-500" /> {t("duplicate")}
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="delete_project">
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenDelete(true)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="h-4 w-4" /> {t("delete")}
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {/* Infos projet */}
        <div>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
            <span>{project.category_name}</span>
            <span>•</span>
            <span>{project.author_name}</span>
            {project.difficulty_level && (
              <>
                <span>•</span>
                <span className="font-medium">{DIFFICULTY_LABELS[project.difficulty_level] ?? project.difficulty_level}</span>
              </>
            )}
            {project.published_at && (
              <>
                <span>•</span>
                <span>{new Date(project.published_at).toLocaleDateString("fr-FR")}</span>
              </>
            )}
            <span>•</span>
            <span className={`font-medium ${project.status === "published" ? "text-green-600" : "text-yellow-600"}`}>
              {project.status}
            </span>
          </div>

          {/* Prix */}
          {project.is_purchasable && project.price && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium">
              <DollarSign className="w-4 h-4" />
              {Number(project.price).toLocaleString("fr-FR")} XOF
            </div>
          )}

          {/* Technologies */}
          {project.technologies && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.split(",").map((tech) => (
                <span key={tech.trim()} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  <Code2 className="w-3 h-3" />{tech.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Liens */}
          <div className="mt-3 flex flex-wrap gap-3">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Globe className="w-3.5 h-3.5" /> Démo en ligne
              </a>
            )}
            {project.repository_url && (
              <a href={project.repository_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:underline">
                <Code2 className="w-3.5 h-3.5" /> Dépôt de code
              </a>
            )}
          </div>
        </div>

        {project.cover_image && (
          <Image src={project.cover_image} alt={project.title} className="w-full h-64 object-cover rounded-lg" width={1200} height={256} unoptimized />
        )}

        {project.excerpt && (
          <p className="text-gray-600 italic border-l-4 border-primary pl-4">{project.excerpt}</p>
        )}

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
        </PageDetail>

      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={project?.title}
      />
    </UrlGuard>
  );
};

export default ProjectDetailPage;
