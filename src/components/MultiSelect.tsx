"use client";
import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type MultiSelectProps = Readonly<{
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxDisplay?: number;
  disabled?: boolean;
  className?: string;
}>;

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  maxDisplay = 3,
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOptions = value
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is MultiSelectOption => o !== undefined);

  const displayed = selectedOptions.slice(0, maxDisplay);
  const extra = value.length - maxDisplay;

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full min-h-[38px] justify-start flex-wrap gap-1 h-auto font-normal",
            className
          )}
        >
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {displayed.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium"
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggle(opt.value); }}
                    className="hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {extra > 0 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                  +{extra}
                </span>
              )}
            </>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat</CommandEmpty>
            <CommandGroup>
              {filtered.map((opt) => (
                <CommandItem
                  key={opt.value}
                  disabled={opt.disabled}
                  onSelect={() => toggle(opt.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(opt.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {value.length > 0 && (
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <X className="w-3 h-3" />
                Tout effacer ({value.length} sélectionné{value.length > 1 ? "s" : ""})
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
