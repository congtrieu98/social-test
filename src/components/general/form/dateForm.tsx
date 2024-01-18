"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateTimePicker } from "@/components/ui/dateTimePicker";
// import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { ROLE, formatDateAPi } from "@/utils/constant";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { SelectSingleEventHandler } from "react-day-picker";
import { UseFormReturn } from "react-hook-form";

const DateForm = ({
  form,
  title,
  name,
  date,
  setDate,
}: {
  form: UseFormReturn;
  title: string;
  name: string;
  placeholder: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) => {
  const { data: session } = useSession();

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{title}</FormLabel>
            <br />
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate as SelectSingleEventHandler}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePickerDemo setDate={setDate} date={date} />
                </div>
              </PopoverContent>
            </Popover> */}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={session?.user?.role !== ROLE.ADMIN}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={setDate}
                  disabled={(date) => name === "deadlines" && date < new Date()
                    // : date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePickerDemo setDate={setDate} date={date} />
                </div>
              </PopoverContent>
            </Popover>
            {/* <DateTimePicker
              date={field.value ? field.value : date}
              setDate={setDate}
              name={name}
            /> */}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DateForm;
