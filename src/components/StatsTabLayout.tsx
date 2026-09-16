"use client";
import { TableSearchInput } from "@/components/TableSearchInput";
import { BarChart2, TableIcon } from "lucide-react";
import { cloneElement, isValidElement, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  /** DataSection - receives onFiltersChange + externalSearch automatically */
  readonly children: React.ReactElement<{
    onFiltersChange?: (q: string) => void;
    externalSearch?: string;
  }>;
  /** Stats panel - receives filterQuery automatically */
  readonly statsPanel: React.ReactElement<{ filterQuery: string }>;
  /** Placeholder text for the search input shown above the tabs */
  readonly searchPlaceholder?: string;
  /** Rendered above the search bar row (e.g. page title + count) */
  readonly aboveSearch?: React.ReactNode;
  /** Rendered on the right side of the search input (e.g. filter toggle buttons) */
  readonly headerRight?: React.ReactNode;
}

/**
 * Wraps any DataSection with Tableau / Statistiques tabs.
 * - Search input is rendered ABOVE the tab bar and stays visible on both tabs.
 * - Both tab panels remain mounted (display:none) to preserve filter state.
 * - filterQuery sent to stats = search + any other filters from DataSection.
 */
export function StatsTabLayout({ children, statsPanel, searchPlaceholder, aboveSearch, headerRight }: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"table" | "stats">("table");
  const [search, setSearch] = useState("");
  const [otherFilters, setOtherFilters] = useState("");

  // Combined filter query for the stats panel (search + filters without pagination)
  const filterQuery = [
    search ? `search=${encodeURIComponent(search)}` : "",
    otherFilters,
  ]
    .filter(Boolean)
    .join("&");

  const tableContent = isValidElement(children)
    ? cloneElement(children, {
        onFiltersChange: setOtherFilters,
        externalSearch: search,
      })
    : children;

  const statsContent = isValidElement(statsPanel)
    ? cloneElement(statsPanel, { filterQuery })
    : statsPanel;

  return (
    <div>
      {/* ── Above search (title + count) ── */}
      {aboveSearch && (
        <div className="px-4 sm:px-6 pt-4 pb-2 bg-background border-b border-border">
          {aboveSearch}
        </div>
      )}

      {/* ── Search row ── */}
      <div className="px-4 sm:px-6 pt-3 pb-3 bg-background border-b border-border flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-48">
          <TableSearchInput
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder ?? t("search_placeholder") ?? "Rechercher..."}
          />
        </div>
        {headerRight && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {headerRight}
          </div>
        )}
      </div>

      {/* ── Tab bar ── */}
      <div className="border-b border-border bg-background flex gap-0 px-4 sm:px-6">
        {(
          [
            { id: "table", icon: <TableIcon className="w-4 h-4" />, label: t("tab_table") },
            { id: "stats", icon: <BarChart2 className="w-4 h-4" />, label: t("tab_stats") },
          ] as const
        ).map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ── Content - both panels stay mounted to preserve filter state ── */}
      <div className={activeTab === "table" ? "" : "hidden"}>{tableContent}</div>
      <div className={activeTab === "stats" ? "" : "hidden"}>{statsContent}</div>
    </div>
  );
}
