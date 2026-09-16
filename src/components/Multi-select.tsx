import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  ChevronDown,
  Loader,
  WandSparkles,
  XCircle,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface MultiselectOption {
  value: string | number;
  label: string;
}

type MultiSelectProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof multiSelectVariants> &
  Readonly<{
    options: MultiselectOption[];
    onValueChange: (id: (string | number)[]) => void;
    defaultValue?: readonly string[];
    placeholder?: string;
    animation?: number;
    maxCount?: number;
    modalPopover?: boolean;
    className?: string;
    setSearch?: (value: string) => void;
    search?: string;
    isFetching?: boolean;
  }>;

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      setSearch,
      search,
      isFetching = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<
      (string | number)[]
    >(Array.from(defaultValue ?? []));
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { t } = useTranslation();

    React.useEffect(() => {
      const defaultArray = Array.from(defaultValue ?? []);
      if (JSON.stringify(defaultArray) !== JSON.stringify(selectedValues)) {
        setSelectedValues(defaultArray);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    React.useEffect(() => {
      if (typeof search === "string") {
        setSearchTerm(search);
      }
    }, [search]);

    const filteredOptions = React.useMemo(() => {
      if (!searchTerm) return options;

      return options.filter((opt) =>
        opt.label?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [options, searchTerm]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string | number) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((id) => id !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    return (
      <div className="relative">
        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          modal={modalPopover}
        >
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              {...props}
              onClick={handleTogglePopover}
              className={cn(
                "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto overflow-x-hidden",
                className,
              )}
              aria-expanded={isPopoverOpen ? "true" : "false"}
              aria-haspopup="listbox"
              aria-label="Multi-select"
            >
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-wrap items-center">
                    {selectedValues.slice(0, maxCount).map((id) => {
                      const option = options.find((o) => o.value === id);
                      return (
                        <Badge
                          key={id}
                          className={cn(
                            isAnimating ? "animate-bounce" : "",
                            multiSelectVariants({ variant }),
                            "truncate",
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {option?.label}
                          <XCircle
                            className="ml-2 h-4 w-4 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(id);
                            }}
                          />
                        </Badge>
                      );
                    })}
                    {selectedValues.length > maxCount && (
                      <Badge
                        className={cn(
                          "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant }),
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} ${t("more")}`}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <XIcon
                      className="h-4 mx-2 cursor-pointer text-muted-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                    />
                    <Separator
                      orientation="vertical"
                      className="flex min-h-6 h-full"
                    />
                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                  <span className="text-sm text-muted-foreground mx-3">
                    {placeholder}
                  </span>
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 overflow-hidden"
            align="start"
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
          >
            <Command shouldFilter={false} className="bg-white">
              <CommandInput
                placeholder={t("search")}
                onKeyDown={handleInputKeyDown}
                value={searchTerm}
                onValueChange={(value) => {
                  setSearchTerm(value);
                  if (typeof setSearch === "function") {
                    setSearch(value);
                  }
                }}
              />
              <CommandList>
                {isFetching ? (
                  <CommandItem disabled>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </CommandItem>
                ) : (
                  <>
                    <CommandEmpty>{t("no_results_found")}</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="all"
                        onSelect={toggleAll}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedValues.length === options.length
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        <span>{t("select_all")}</span>
                      </CommandItem>
                      {filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(
                          option.value,
                        );
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => toggleOption(option.value)}
                            className="cursor-pointer"
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible",
                              )}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </div>
                            <span>{option.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <div className="flex items-center gap-2 justify-between">
                        {selectedValues.length > 0 && (
                          <div className="flex items-center w-1/2">
                            <CommandItem
                              onSelect={handleClear}
                              className="flex-1 justify-center bg-red-500 text-white font-bold  hover:bg-red-500/80 hover:text-white cursor-pointer"
                            >
                              {t("clear")}
                            </CommandItem>
                            <Separator
                              orientation="vertical"
                              className="flex ml-2 min-h-6 h-full"
                            />
                          </div>
                        )}
                        <CommandItem
                          onSelect={() => setIsPopoverOpen(false)}
                          className={`flex-1 bg-secondary font-bold  hover:bg-secondary/80 justify-center cursor-pointer ${selectedValues.length > 0 ? "w-1/2" : "w-full"}`}
                        >
                          {t("close")}
                        </CommandItem>
                      </div>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
              isAnimating ? "" : "text-muted-foreground",
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
