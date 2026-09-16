"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  readonly placeholder?: string;
  readonly dates: Date | undefined;
  readonly onValueChange: (date: Date | undefined) => void;
};

export function DatePicker({ placeholder, onValueChange, dates }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dates}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
        >
          <CalendarIcon />
          {dates ? (
            format(dates, "PP", { locale: fr })
          ) : (
            <span>{placeholder ?? "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dates}
          onSelect={(date) => onValueChange(date)}
        />
      </PopoverContent>
    </Popover>
  );
}
