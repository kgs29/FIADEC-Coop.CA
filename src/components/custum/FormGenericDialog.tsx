import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface GenericDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleIcon?: React.ReactNode;
  confirmMessage?: string;
  selectedItems?: T[];
  renderItem?: (item: T) => React.ReactNode;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  isLoading?: boolean;
  cancelLabel?: string;

  desagLevels?: { id: string; name: string }[];
  selectedLevels?: string[];
  setSelectedLevels?: React.Dispatch<React.SetStateAction<string[]>>;
}

type WithId = {
  id: string | number;
};
export function GenericDialog<T extends WithId>({
  open,
  onOpenChange,
  title,
  titleIcon,
  confirmMessage,
  selectedItems = [],
  renderItem,
  primaryActionLabel,
  onPrimaryAction,
  isLoading = false,
  cancelLabel = "cancel",
  desagLevels,
  selectedLevels = [],
  setSelectedLevels,
}: Readonly<GenericDialogProps<T>>) {
  const { t } = useTranslation();

  // ✅ Handler extrait (plus de nested functions)
  const handleLevelChange = (checked: boolean, levelId: string) => {
    if (!setSelectedLevels) return;

    setSelectedLevels((prev) => {
      if (checked) {
        if (prev.includes(levelId)) {
          return prev;
        }
        return [...prev, levelId];
      }

      return prev.filter((id) => id !== levelId);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl"
        {...(!confirmMessage && { "aria-describedby": undefined })}
      >
        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          {titleIcon}
          {title}
        </DialogTitle>

        <div className="space-y-4">
          {confirmMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <DialogDescription className="text-sm text-gray-700 leading-relaxed">
                {confirmMessage}
              </DialogDescription>
            </div>
          )}

          {selectedItems.length > 0 && renderItem && (
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                {t("selectElements")} ({selectedItems.length})
              </p>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div key={item.id}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          )}

          {desagLevels && desagLevels.length > 0 && (
            <div className="border rounded-xl p-5 max-h-72 overflow-auto bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-4">
                Niveaux de désagrégation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {desagLevels.map((level) => {
                  const isChecked = selectedLevels.includes(level.id);

                  return (
                    <label
                      key={level.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${
                          isChecked
                            ? "bg-primary/10 border-primary"
                            : "bg-white border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleLevelChange(e.target.checked, level.id)
                        }
                        className="h-4 w-4 accent-primary"
                      />

                      <span className="text-sm font-medium text-gray-700">
                        {level.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            size="lg"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
            aria-label={t("cancel")}
          >
            {t(cancelLabel)}
          </Button>

          <Button
            onClick={onPrimaryAction}
            size="lg"
            className="min-w-[160px] text-white"
          >
            {isLoading && <Loader />}
            {titleIcon && <span className="text-white">{titleIcon}</span>}
            {primaryActionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}