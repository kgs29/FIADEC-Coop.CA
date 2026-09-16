"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type FileFormat = "csv" | "excel";

interface ExportDataProps {
  onExport: (fileFormat: FileFormat) => void;
  initialFormat?: FileFormat;
  className?: string;
  tooltip?: string;
}

export function ExportData({
  onExport,
  initialFormat = "excel",
  className = "",
  tooltip,
}: ExportDataProps) {
  const [file_format, setFileFormat] = useState<FileFormat>(initialFormat);

  const { t } = useTranslation();
  const handleExport = () => {
    onExport(file_format);
  };

  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <select
        className="
      border border-gray-300 dark:border-gray-600
      px-3 py-1.5 rounded-lg
      bg-white dark:bg-gray-800
      text-gray-700 dark:text-gray-200
      focus:outline-none focus:border-primary-500
      transition-all shadow-sm
      hover:border-gray-400 dark:hover:border-gray-500
      text-sm
    "
        value={file_format}
        onChange={(e) => setFileFormat(e.target.value as FileFormat)}
      >
        <option value="excel">Excel (.xlsx)</option>
        <option value="csv">CSV (.csv)</option>
      </select>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleExport}
              variant="outline"
              className="
      rounded-full
      border border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-200
      hover:bg-gray-100 dark:hover:bg-gray-700
      bg-transparent
      px-4 py-1.5
      shadow-sm
      transition-colors
      flex items-center gap-2
      text-sm
      hover:shadow-md
    "
            >
              <Download className="w-4 h-4" />
              {t("export")}
            </Button>
          </TooltipTrigger>
          {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
