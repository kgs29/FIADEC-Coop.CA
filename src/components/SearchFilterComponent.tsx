/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  Plus,
  PlusCircle,
  Sliders,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "./ui/label";

export type FilterOperator =
  | "eq"
  | "neq"
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "eqNum"
  | "after"
  | "before"
  | "on"
  | "in"
  | "notIn";

export type FilterCondition<T> = {
  field: keyof T;
  operator: FilterOperator;
  value: any;
};

export type FieldConfig<T> = {
  type: "string" | "number" | "date" | "select" | "boolean";
  label: string;
  options?: { value: any; label: string }[];
};

export type GenericFilterProps<T> = {
  model: Partial<T>;
  filters: FilterCondition<T>[];
  onChange: (filters: FilterCondition<T>[]) => void;
  fieldConfig: Partial<Record<keyof T, FieldConfig<T>>>;
  className?: string;
};

export const operatorLabels: Record<FilterOperator, string> = {
  eq: "=",
  neq: "≠",
  contains: "contient",
  notContains: "ne contient pas",
  startsWith: "commence par",
  endsWith: "finit par",
  gt: ">",
  lt: "<",
  gte: "≥",
  lte: "≤",
  eqNum: "=",
  after: "après",
  before: "avant",
  on: "le",
  in: "dans",
  notIn: "pas dans",
};

const getOperatorsForType = (type: string): FilterOperator[] => {
  switch (type) {
    case "string":
      return ["eq", "neq", "contains", "notContains", "startsWith", "endsWith"];
    case "number":
      return ["eqNum", "gt", "lt", "gte", "lte"];
    case "date":
      return ["after", "before", "on"];
    case "select":
      return ["in", "notIn"];
    case "boolean":
      return ["eq"];
    default:
      return ["eq", "neq"];
  }
};

export function GenericFilter<T>({
  model,
  filters,
  onChange,
  fieldConfig = {},
  className,
}: GenericFilterProps<T>) {
  const [newFilterField, setNewFilterField] = React.useState<keyof T | "">("");
  const [newFilterOperator, setNewFilterOperator] = React.useState<
    FilterOperator | ""
  >("");
  const [newFilterValue, setNewFilterValue] = React.useState<any>("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined
  );
  const [advancedFilters, setAdvancedFilters] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const fields = Object.keys(model as object).filter(
    (f) => fieldConfig[f as keyof T] !== undefined
  ) as Array<keyof T>;

  const getFieldType = (field: keyof T): string => {
    return fieldConfig[field]?.type || "string";
  };

  const getDateRangeLabel = (range: DateRange | undefined): string => {
    if (!range?.from) return t("select_date");
    if (!range.to) return format(range.from, "dd/MM/yyyy");
    return `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`;
  };

  const addFilter = () => {
    if (!newFilterField || !newFilterOperator) return;

    const newFilter: FilterCondition<T> = {
      field: newFilterField,
      operator: newFilterOperator,
      value: newFilterValue,
    };

    onChange([...filters, newFilter]);
    resetForm();
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    onChange(newFilters);
  };

  const resetForm = () => {
    setNewFilterField("");
    setNewFilterOperator("");
    setNewFilterValue("");
    setDateRange(undefined);
  };

  const renderValueInput = (field: keyof T, newFilterOperator: string) => {
    const fieldType = getFieldType(field);
    const config = fieldConfig[field];

    if (fieldType === "select" && config?.options) {
      return (
        <Select onValueChange={setNewFilterValue} value={newFilterValue}>
          <SelectTrigger className="min-w-[180px] bg-background">
            <SelectValue placeholder={t("select_value")} />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option) => (
              <SelectItem key={String(option.value)} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (fieldType === "date") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[240px] justify-start text-left font-normal bg-background",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateRangeLabel(dateRange)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              captionLayout="dropdown-buttons"
              fromYear={new Date().getFullYear() - 75}
              toYear={new Date().getFullYear() + 75}
              onSelect={(range) => {
                setDateRange(range);
                setNewFilterValue(range);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    if (fieldType === "number") {
      return (
        <Input
          type="number"
          value={newFilterValue}
          onChange={(e) => setNewFilterValue(Number(e.target.value))}
          className="w-[120px] bg-background"
          placeholder={t("value")}
        />
      );
    }

    if (fieldType === "boolean") {
      return (
        <Select onValueChange={setNewFilterValue} value={newFilterValue}>
          <SelectTrigger className="min-w-[120px] bg-background">
            <SelectValue placeholder={t("select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">{t("yes")}</SelectItem>
            <SelectItem value="false">{t("no")}</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        value={newFilterValue}
        onChange={(e) => setNewFilterValue(e.target.value)}
        placeholder={t("value")}
        className="min-w-[180px] bg-background"
      />
    );
  };

  const formatFilterValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object" && "from" in value) {
      return value.to
        ? `${format(value.from, "dd/MM/yyyy")} - ${format(
            value.to,
            "dd/MM/yyyy"
          )}`
        : format(value.from, "dd/MM/yyyy");
    }
    return String(value);
  };

  return (
    <div className={cn("w-full space-y-1 my-4", className)}>
      {/* Toggle header - version améliorée */}
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 p-3 border rounded-lg transition-all cursor-pointer w-full text-left",
          "hover:bg-muted/20 active:bg-muted/30",
          "bg-gradient-to-b from-background to-muted/10",
          advancedFilters
            ? "border-primary/30 shadow-sm rounded-b-none border-b-0"
            : "border-muted shadow-xs hover:shadow-sm"
        )}
        onClick={() => setAdvancedFilters((prev) => !prev)}
      >
        <div
          className={cn(
            "p-2 rounded-lg bg-primary/10 text-primary",
            "flex items-center justify-center"
          )}
        >
          <Sliders className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-foreground">
            {t("advanced_filters")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {filters.length > 0
              ? `${filters.length} ${t(
                  filters.length > 1 ? "actives" : "active"
                )}`
              : t("no_filters")}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            advancedFilters ? "rotate-180 text-primary" : ""
          )}
        />
      </button>

      {/* Filters panel - version premium */}
      <AnimatePresence>
        {advancedFilters && (
          <motion.div
            key="advanced-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "p-4 border rounded-b-lg",
                "bg-background shadow-sm",
                "border-t-0 border-primary/30"
              )}
            >
              {/* Active filters - version badge améliorée */}
              {filters.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <Filter className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-medium text-foreground">
                      {t("active_filters")}
                    </h4>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {filters.length}{" "}
                      {t(filters.length > 1 ? "items" : "item")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={cn(
                          "flex items-center gap-1.5 py-1 px-3 rounded-full",
                          "bg-muted/50 hover:bg-muted border-muted-foreground/20",
                          "transition-colors duration-150"
                        )}
                      >
                        <span className="font-medium text-xs text-foreground">
                          {fieldConfig[filter.field]?.label ||
                            String(filter.field)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {t(operatorLabels[filter.operator])}
                        </span>
                        <span className="text-xs text-foreground/80">
                          {formatFilterValue(filter.value)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFilter(index);
                          }}
                          aria-label={t("reset_filter")}
                          className={cn(
                            "ml-1 rounded-full p-0.5",
                            "hover:bg-muted-foreground/10",
                            "text-muted-foreground hover:text-foreground",
                            "transition-colors"
                          )}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add new filter form - version élégante */}
              <div>
                <h4
                  className={cn(
                    "text-sm font-medium mb-3",
                    "flex items-center gap-2",
                    "text-foreground"
                  )}
                >
                  <PlusCircle className="h-4 w-4 text-primary" />
                  {t("add_new_filter")}
                </h4>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  {/* Field selection */}
                  <div className="flex-1 min-w-[160px]">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      {t("Champ")}
                    </Label>
                    <Select
                      value={String(newFilterField)}
                      onValueChange={(value) => {
                        setNewFilterField(value as keyof T);
                        setNewFilterOperator("");
                        setNewFilterValue("");
                      }}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder={t("select_field")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {fields.map((field) => (
                          <SelectItem
                            key={String(field)}
                            value={String(field)}
                          >
                            {fieldConfig[field]?.label || String(field)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operator selection */}
                  {newFilterField && (
                    <div className="flex-1 min-w-[120px]">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        {t("operateur")}
                      </Label>
                      <Select
                        value={newFilterOperator}
                        onValueChange={(value) =>
                          setNewFilterOperator(value as FilterOperator)
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder={t("operator")} />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {getOperatorsForType(
                            getFieldType(newFilterField)
                          ).map((op) => (
                            <SelectItem
                              key={op}
                              value={op}
                              className="hover:bg-muted/50 focus:bg-muted/50"
                            >
                              {t(operatorLabels[op])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Value input */}
                  {newFilterField && newFilterOperator && (
                    <div className="flex-1 min-w-[160px]">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        {t("valeur")}
                      </Label>
                      {renderValueInput(newFilterField, newFilterOperator)}
                    </div>
                  )}

                  {/* Add button - version premium */}
                  <Button
                    onClick={addFilter}
                    disabled={!newFilterField || !newFilterOperator}
                    aria-label={t("add")}
                    className={cn(
                      "h-10 gap-2 px-4",
                      "bg-primary hover:bg-primary/90",
                      "text-primary-foreground",
                      "transition-all duration-200",
                      "shadow-sm hover:shadow-md",
                      "disabled:opacity-50 disabled:pointer-events-none"
                    )}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    {t("add")}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function convertToDjangoQueryString<T>(
  filters: FilterCondition<T>[],
  fieldConfig: Partial<Record<keyof T, FieldConfig<T>>>,
  extraParams: Record<string, any> = {} // pour page, size, etc.
): string {
  const params = new URLSearchParams();
  const EXACT_LOOKUP = "exact";

  filters.forEach((filter) => {
    const field = String(filter.field);
    const operator = filter.operator;
    const value = filter.value;
    const fieldType = fieldConfig[filter.field]?.type || "string";

    let lookup: string | null = null;
    let finalValue: any = value;

    switch (operator) {
      case "eq":
        lookup = EXACT_LOOKUP;
        finalValue = fieldType === "boolean" ? value === "true" : value;
        break;
      case "neq":
        lookup = "not_exact";
        break;

      case "contains":
        lookup = "icontains";
        break;
      case "notContains":
        lookup = "not_icontains";
        break;
      case "startsWith":
        lookup = "istartswith";
        break;
      case "endsWith":
        lookup = "iendswith";
        break;

      case "eqNum":
        lookup = EXACT_LOOKUP;
        break;
      case "gt":
      case "after":
        lookup = "gt";
        break;
      case "lt":
      case "before":
        lookup = "lt";
        break;
      case "gte":
        lookup = "gte";
        break;
      case "lte":
        lookup = "lte";
        break;
      case "on":
        lookup = EXACT_LOOKUP;
        break;

      case "in":
        lookup = "icontains";
        break;

      case "notIn":
        lookup = "not_icontains";
        break;

      default:
        console.warn(`Unsupported or backend-only operator: ${operator}`);
        return;
    }

    if (!lookup) return;

    const paramName = `${field}__${lookup}`;
    const paramValue =
      fieldType === "date"
        ? formatDateForDjango(finalValue?.from || finalValue)
        : finalValue;

    params.set(paramName, paramValue);
  });

  // Ajouter les paramètres supplémentaires comme page, size, ordering...
  Object.entries(extraParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      params.set(key, String(val));
    }
  });

  return params.toString();
}

function formatDateForDjango(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Format: YYYY-MM-DD
}
