"use client";
import { ImportModal } from "@/components/ImportModal";
import { Button } from "@/components/ui/button";
import { importFile } from "@/lib/bulkApi";
import PermissionGuard from "@/lib/PermissionGuard";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProjectLinkSection = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [importOpen, setImportOpen] = useState(false);

  return (
    <PermissionGuard permission="add_project">
      <div className="flex justify-end gap-2 my-4 p-3">
        <Button variant="outline" className="btn-import" title="Importer" onClick={() => setImportOpen(true)} aria-label="Importer">
          <Upload className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Importer</span>
        </Button>
        <Link href={`${pathname}/add`}>
          <Button className="btn-create" title={t("create")} aria-label={t("create")}>
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("create")}</span>
          </Button>
        </Link>
      </div>
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={(f) => importFile("projects", f)}
        resourceName="Projets"
        templateFields={["title", "content", "excerpt", "category_name", "status", "technologies"]}
      />
    </PermissionGuard>
  );
};

export default ProjectLinkSection;
