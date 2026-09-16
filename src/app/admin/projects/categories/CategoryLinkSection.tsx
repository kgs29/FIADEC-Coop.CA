"use client";
import { Button } from "@/components/ui/button";
import PermissionGuard from "@/lib/PermissionGuard";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const CategoryLinkSection = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <PermissionGuard permission="add_projectcategory">
      <div className="flex justify-end gap-2 my-4 p-3">
        <Link href={`${pathname}/add`}>
          <Button className="btn-create" title={t("create")} aria-label={t("create")}>
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("create")}</span>
          </Button>
        </Link>
      </div>
    </PermissionGuard>
  );
};

export default CategoryLinkSection;
