"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LoadingButton } from "@/components/ui/loading-btn";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  /** Nom de l'élément à supprimer (affiché dans le message) */
  itemName?: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  itemName,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md">
        {/* Icône */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
          </div>

          <div className="text-center space-y-1">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {t("delete_confirmation_title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {itemName
                ? t("delete_confirmation_named", { name: itemName })
                : t("do_you_really_want_to_delete")}
            </DialogDescription>
            <p className="text-xs text-red-500 dark:text-red-400 font-medium">
              {t("action_irreversible")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2 pb-1">
          <Button
            variant="outline"
            className="btn-cancel min-w-[100px]"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <LoadingButton
            variant="destructive"
            className="min-w-[120px]"
            loading={loading}
            onClick={onConfirm}
          >
            {t("delete")}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
