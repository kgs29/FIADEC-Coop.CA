"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Archive,
  Copy,
  Download,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export interface BulkActions {
  onDelete?: () => void;
  onArchive?: () => void;
  onExportExcel?: () => void;
  onExportCsv?: () => void;
  onDuplicate?: () => void;
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkActions;
  onClear: () => void;
  isLoading?: boolean;
}

export function BulkActionBar({
  selectedCount,
  actions,
  onClear,
  isLoading,
}: BulkActionBarProps) {
  const { t } = useTranslation();

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg">
      {/* Compteur + effacer */}
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
          {selectedCount}
        </span>
        <span className="hidden sm:inline">
          {selectedCount === 1 ? "élément sélectionné" : "éléments sélectionnés"}
        </span>
      </div>

      <div className="flex-1" />

      {/* Menu actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="default" disabled={isLoading} className="gap-1.5 btn-action" title={t("actions")}>
            <Settings className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("actions")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {actions.onExportExcel && (
            <DropdownMenuItem onClick={actions.onExportExcel} className="gap-2 cursor-pointer">
              <Download className="h-4 w-4 text-emerald-600" />
              Exporter Excel
            </DropdownMenuItem>
          )}
          {actions.onExportCsv && (
            <DropdownMenuItem onClick={actions.onExportCsv} className="gap-2 cursor-pointer">
              <Download className="h-4 w-4 text-blue-600" />
              Exporter CSV
            </DropdownMenuItem>
          )}
          {(actions.onExportExcel || actions.onExportCsv) &&
            (actions.onArchive || actions.onDuplicate || actions.onDelete) && (
              <DropdownMenuSeparator />
            )}
          {actions.onArchive && (
            <DropdownMenuItem onClick={actions.onArchive} className="gap-2 cursor-pointer">
              <Archive className="h-4 w-4 text-orange-500" />
              Archiver
            </DropdownMenuItem>
          )}
          {actions.onDuplicate && (
            <DropdownMenuItem onClick={actions.onDuplicate} className="gap-2 cursor-pointer">
              <Copy className="h-4 w-4 text-violet-500" />
              Dupliquer
            </DropdownMenuItem>
          )}
          {actions.onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={actions.onDelete}
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Fermer */}
      <button
        onClick={onClear}
        className="p-1 rounded hover:bg-gray-200 transition-colors"
        title={t("deselect_all")}
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}
