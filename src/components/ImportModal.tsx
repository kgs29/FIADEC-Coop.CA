"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ImportResult {
  created: number;
  errors: { row: number; errors: unknown }[];
}

type ImportModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<ImportResult>;
  templateFields: string[];
  resourceName: string;
}>;

export function ImportModal({
  open,
  onClose,
  onImport,
  templateFields,
  resourceName,
}: ImportModalProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext ?? "")) {
      setError("Format non supporté. Utilisez CSV ou XLSX.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await onImport(file);
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de l'import.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = templateFields.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template_${resourceName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Importer - {resourceName}
        </DialogTitle>

        <div className="space-y-4">
          {/* Template download */}
          <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <span>Téléchargez le modèle CSV pour commencer</span>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              Modèle CSV
            </Button>
          </div>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : file
                ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-green-700">
                <FileSpreadsheet className="h-8 w-8" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} Ko
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="ml-2 p-0.5 rounded hover:bg-green-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-gray-400 space-y-2">
                <Upload className="h-10 w-10 mx-auto" />
                <p className="text-sm font-medium">
                  Glissez un fichier ou <span className="text-primary underline">parcourez</span>
                </p>
                <p className="text-xs">CSV, XLSX - max 10 Mo</p>
              </div>
            )}
          </div>

          {/* Résultat */}
          {result && (
            <div
              className={`rounded-lg p-3 text-sm ${
                result.errors.length === 0
                  ? "bg-green-50 text-green-800"
                  : "bg-yellow-50 text-yellow-800"
              }`}
            >
              <p className="font-semibold">
                ✓ {result.created} ligne{result.created !== 1 ? "s" : ""} importée{result.created !== 1 ? "s" : ""}
              </p>
              {result.errors.length > 0 && (
                <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
                  {result.errors.slice(0, 5).map((e) => (
                    <li key={e.row}>
                      Ligne {e.row} : {JSON.stringify(e.errors)}
                    </li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>… et {result.errors.length - 5} autre(s) erreur(s)</li>
                  )}
                </ul>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            <X className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("cancel")}</span>
          </Button>
          <Button onClick={handleSubmit} disabled={!file || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 shrink-0" />
            )}
            <span className="hidden sm:inline">Importer</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
