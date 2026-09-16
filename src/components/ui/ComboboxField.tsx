import React from "react";
import { Check, ChevronDown, Loader, Plus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, Path, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Option {
  id: string | number;
  libelle: string;
}

interface ComboboxFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  options: Option[];
  label: string;
  placeholder?: string;
  idType?: "string" | "number";
  disabled?: boolean;
  required?: boolean;
  search?: string;
  setSearch?: (value: string) => void;
  isFetching?: boolean;
  /** Si fourni, affiche "Créer et modifier" quand aucun résultat ne correspond */
  onCreateNew?: (name: string) => void;
}

const ComboboxField = <T extends FieldValues>({
  form,
  name,
  options,
  label,
  placeholder,
  search,
  setSearch,
  isFetching = false,
  idType = "string",
  onCreateNew,
  ...rest
}: ComboboxFieldProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    if (typeof search === "string") {
      setSearchTerm(search);
    }
  }, [search]);

  const { t } = useTranslation();

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;

    return options.filter((opt) =>
      opt.libelle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const currentValue =
          idType === "number" ? Number(field.value) : String(field.value);

        return (
          <FormItem className="w-full">
            <FormLabel required={rest.required || false}>{label}</FormLabel>
            <FormControl className="flex-1 w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={rest.disabled || false}
                    variant="outline"
                    role="combobox"
                    aria-label={t("select_an_option")}
                    aria-expanded={Boolean(field.value)}
                    className="w-full justify-between overflow-hidden"
                  >
                    <span className="truncate">
                      {currentValue && options.length > 0
                        ? options.find(
                            (c) =>
                              (idType === "number"
                                ? Number(c.id)
                                : String(c.id)) === currentValue
                          )?.libelle
                        : placeholder || t("select_an_option")}
                    </span>

                    {isFetching ? (
                      <Loader className="ml-2 h-4 w-4 animate-spin opacity-70" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full">
                  <Command shouldFilter={false}>
                    {" "}
                    {/* Désactive le filtrage interne */}
                    <CommandInput
                      placeholder={t("search_placeholder")}
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
                          {t("loading")}...
                        </CommandItem>
                      ) : (
                        <>
                          <CommandGroup>
                            {filteredOptions.map((c) => {
                              const optionValue =
                                idType === "number"
                                  ? Number(c.id)
                                  : String(c.id);

                              return (
                                <CommandItem
                                  key={c.id}
                                  onSelect={() => {
                                    field.onChange(optionValue);
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      currentValue === optionValue
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                  {c.libelle}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                          {filteredOptions.length === 0 && (
                            onCreateNew ? (
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    onCreateNew(searchTerm);
                                  }}
                                  className="text-primary cursor-pointer"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Créer et modifier{searchTerm ? ` "${searchTerm}"` : ""}
                                </CommandItem>
                              </CommandGroup>
                            ) : (
                              <CommandEmpty>{t("no_results")}</CommandEmpty>
                            )
                          )}
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ComboboxField;
