"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface PageFormProps {
  title: string;
  children: React.ReactNode;
  /** Triggered when the "Enregistrer" button is clicked or form is submitted */
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  /** Callback for the Cancel button */
  onCancel: () => void;
  /** Shows a loading spinner on the submit button */
  isLoading?: boolean;
  /** Custom text for the submit button. Defaults to "Enregistrer" */
  submitText?: string;
  /** Custom text for the cancel button. Defaults to "Annuler" */
  cancelText?: string;
}

export function PageForm({
  title,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText,
  cancelText,
}: Readonly<PageFormProps>) {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {children}
        </CardContent>

        <CardFooter className="flex justify-end gap-x-2 pt-6 border-t border-border mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
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
        </CardFooter>
      </form>
    </Card>
  );
}
