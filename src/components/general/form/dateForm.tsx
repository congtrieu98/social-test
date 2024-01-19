"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatNo } from "@/utils/constant";

import moment from "moment";

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
  date: string;
  setDate: (date: string) => void;
}) => {
  const handleChangeTime = (e: any) => {
    setDate(e.target.value);
  };

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{title}</FormLabel>
            <br />
            <input
              id="dateTime"
              type="datetime-local"
              name="partydate"
              value={
                field.value
                  ? moment(field.value).format(formatNo).toString()
                  : date
              }
              onChange={(e) => handleChangeTime(e)}
              className="p-2 w-full inline-flex items-center justify-center whitespace-nowrap
              rounded-md text-sm font-medium ring-offset-background transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
              border border-input bg-background hover:bg-accent hover:text-accent-foreground
              "
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DateForm;
