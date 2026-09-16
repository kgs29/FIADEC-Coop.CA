"use client";
import { generateBreadcrumbs } from "@/utils/breackcrumbs-config";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

interface CancelButtonProps {
  message?: string;
  path?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ message, path }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const pathnames = generateBreadcrumbs(pathname);

  const getRouteTo = () => {
    if (path) return path;
    if (pathnames.length > 1) return pathnames[pathnames.length - 2].path;
    return "/dashboard";
  };

  return (
    <div className="my-4">
      <Link
        className="btn-cancel inline-flex items-center gap-x-2 rounded p-[8px] px-4 transition-opacity hover:opacity-90 border border-border"
        href={getRouteTo()}
        title={message ?? t("cancel")}
      >
        <X className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{message ?? t("cancel")}</span>
      </Link>
    </div>
  );
};

export default CancelButton;
