
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  multiSelect?: boolean;
  selectedDates?: Date[];
}

export function DatePicker({ selected, onSelect, multiSelect = false, selectedDates = [] }: DatePickerProps) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && !selectedDates.length && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? (
              format(selected, "PPP")
            ) : selectedDates.length > 0 ? (
              `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {multiSelect ? (
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={onSelect as any}
              initialFocus
            />
          ) : (
            <Calendar
              mode="single"
              selected={selected}
              onSelect={onSelect}
              initialFocus
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
