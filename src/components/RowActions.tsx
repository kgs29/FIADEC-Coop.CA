"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Globe, GlobeLock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  separator?: boolean;
}

type RowActionsProps = Readonly<{
  actions: RowAction[];
}>;

export function RowActions({ actions }: RowActionsProps) {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label={t("actions")}
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {actions.map((action, i) => (
          <span key={action.label}>
            {action.separator && i > 0 && <DropdownMenuSeparator />}
            {action.href ? (
              <DropdownMenuItem asChild>
                <Link
                  href={action.href}
                  className={`flex items-center gap-2 cursor-pointer ${
                    action.variant === "danger" ? "text-red-600 focus:text-red-600" : ""
                  }`}
                >
                  {action.icon}
                  {action.label}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={action.onClick}
                className={
                  action.variant === "danger"
                    ? "text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            )}
          </span>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Icônes réexportées pour usage dans les datasections
export { Eye, Globe, GlobeLock, Pencil, Trash2 };
