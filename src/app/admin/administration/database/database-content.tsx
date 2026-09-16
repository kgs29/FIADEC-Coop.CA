"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { BASE_API_URL } from "@/constants/env";
import { AlertTriangle, CheckCircle2, Database, Download, FileArchive, Loader2, Upload, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${JSON.parse(token)}` } : {};
}

type OpState = "idle" | "loading" | "success" | "error";

export default function DatabaseContent() {
  const { t } = useTranslation();

  const [exportState, setExportState] = useState<OpState>("idle");
  const [exportError, setExportError] = useState<string | null>(null);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importState, setImportState] = useState<OpState>("idle");
  const [importError, setImportError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExportState("loading");
    setExportError(null);
    try {
      const res = await fetch(`${BASE_API_URL}core/database/export/`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `Erreur ${res.status}`);
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="?([^"]+)"?/.exec(cd);
      const filename = match?.[1] ?? `backup_${Date.now()}.zip`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setExportState("success");
    } catch (e: unknown) {
      setExportError(e instanceof Error ? e.message : t("db.unknownError"));
      setExportState("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImportFile(f);
    setImportState("idle");
    setImportError(null);
    setImportMessage(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["zip", "sql", "dump", "backup"].includes(ext)) return;
    setImportFile(f);
    setImportState("idle");
    setImportError(null);
    setImportMessage(null);
  };

  const handleImport = async () => {
    if (!importFile) return;
    setShowConfirm(false);
    setImportState("loading");
    setImportError(null);
    setImportMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", importFile);
      const res = await fetch(`${BASE_API_URL}core/database/import/`, {
        method: "POST",
        headers: getAuthHeader(),
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Erreur ${res.status}`);
      setImportState("success");
      setImportMessage(json.message ?? t("db.importSuccess"));
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: unknown) {
      setImportError(e instanceof Error ? e.message : t("db.unknownError"));
      setImportState("error");
    }
  };

  const isZip = importFile?.name.toLowerCase().endsWith(".zip");

  return (
    <div className="m-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("db.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("db.subtitle")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ─── Export ─── */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FileArchive className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{t("db.exportTitle")}</h2>
              <p className="text-xs text-muted-foreground">{t("db.exportSubtitle")}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("db.exportDescription")}
          </p>

          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
            <li><code className="bg-muted px-1 rounded">backup_*.sql</code> - {t("db.exportSqlDesc")}</li>
            <li><code className="bg-muted px-1 rounded">media/</code> - {t("db.exportMediaDesc")}</li>
          </ul>

          {exportState === "success" && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {t("db.exportSuccess")}
            </div>
          )}
          {exportState === "error" && exportError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-all">{exportError}</span>
            </div>
          )}

          <Button
            className="mt-auto btn-export"
            title={t("db.exportButton")}
            onClick={handleExport}
            disabled={exportState === "loading"}
          >
            {exportState === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0 sm:mr-2" />
            ) : (
              <Download className="h-4 w-4 shrink-0 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {exportState === "loading" ? t("db.exportLoading") : t("db.exportButton")}
            </span>
          </Button>
        </div>

        {/* ─── Import ─── */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Upload className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{t("db.importTitle")}</h2>
              <p className="text-xs text-muted-foreground">{t("db.importSubtitle")}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-lg">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>{t("db.importWarningTitle")}</strong>{" "}{t("db.importWarning")}
            </span>
          </div>

          <label
            htmlFor="db-file-input"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {isZip ? (
              <FileArchive className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            {importFile ? (
              <span className="text-sm font-medium text-primary break-all text-center">
                {importFile.name}
              </span>
            ) : (
              <>
                <span className="text-sm font-medium">{t("db.dropZoneText")}</span>
                <span className="text-xs text-muted-foreground">{t("db.dropZoneClick")}</span>
                <span className="text-xs text-muted-foreground">{t("db.dropZoneFormats")}</span>
              </>
            )}
            {isZip && (
              <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                {t("db.zipLabel")}
              </span>
            )}
            <input
              id="db-file-input"
              ref={fileInputRef}
              type="file"
              accept=".zip,.sql,.dump,.backup"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {importState === "success" && importMessage && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {importMessage}
            </div>
          )}
          {importState === "error" && importError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-all">{importError}</span>
            </div>
          )}

          <Button
            className="mt-auto btn-import"
            title={t("db.importButton")}
            variant="outline"
            onClick={() => setShowConfirm(true)}
            disabled={!importFile || importState === "loading"}
          >
            {importState === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0 sm:mr-2" />
            ) : (
              <Upload className="h-4 w-4 shrink-0 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {importState === "loading" ? t("db.importLoading") : t("db.importButton")}
            </span>
          </Button>
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            {t("db.confirmTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("db.confirmFrom")}{" "}
            <strong className="text-foreground">{importFile?.name}</strong>.
          </DialogDescription>
          {isZip ? (
            <p className="text-sm text-muted-foreground">{t("db.confirmZipMsg")}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{t("db.confirmSqlMsg")}</p>
          )}
          <p className="text-sm font-medium text-amber-700">{t("db.confirmQuestion")}</p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              {t("db.confirmYes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
