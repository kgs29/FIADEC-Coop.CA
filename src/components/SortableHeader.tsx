"use client";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/hooks/useTableSort";

interface SortableHeaderProps {
  label: React.ReactNode;
  sortKey: string;
  currentKey: string | null;
  currentDir: SortDir;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className,
}: SortableHeaderProps) {
  const isActive = currentKey === sortKey;

  return (
    <th className={cn("px-4 py-3 text-left", className)}>
      <button
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 group select-none font-medium text-muted-foreground hover:text-foreground transition-colors text-xs uppercase tracking-wide"
      >
        {label}
        <span className="transition-colors">
          {isActive ? (
            currentDir === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5 text-primary" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-primary" />
            )
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
          )}
        </span>
      </button>
    </th>
  );
}
