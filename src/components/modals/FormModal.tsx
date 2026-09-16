"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Prevent closing when clicking outside the modal */
  preventOutsideClick?: boolean;
  /** Triggered when the "Enregistrer" button is clicked or form is submitted */
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  /** Shows a loading spinner on the submit button */
  isLoading?: boolean;
  /** Custom text for the submit button. Defaults to "Enregistrer" */
  submitText?: string;
  /** Custom text for the cancel button. Defaults to "Annuler" */
  cancelText?: string;
  /** Custom width class. Defaults to "sm:max-w-[600px]" */
  maxWidth?: string;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  preventOutsideClick = true,
  onSubmit,
  isLoading = false,
  submitText,
  cancelText,
  maxWidth = "sm:max-w-[600px]",
}: Readonly<FormModalProps>) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onInteractOutside={(e) => {
          if (preventOutsideClick) {
            e.preventDefault();
          }
        }}
        className={`${maxWidth} w-full max-h-[90vh] overflow-y-auto flex flex-col`}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          {/* Form Fields */}
          <div className="py-2">
            {children}
          </div>

          {/* Form Actions / Buttons */}
          <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-border mt-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              title={cancelText || t("cancel", "Annuler")}
              className="w-10 h-10 p-0 sm:w-auto sm:h-8 sm:px-4"
            >
              <X className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{cancelText || t("cancel", "Annuler")}</span>
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              title={submitText || t("save", "Enregistrer")}
              className="w-10 h-10 p-0 sm:w-auto sm:h-8 sm:px-4"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 sm:mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">{submitText || t("save", "Enregistrer")}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
