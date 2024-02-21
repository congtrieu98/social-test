"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDateFull, formatDatetime, formatNo } from "@/utils/constant";

import moment from "moment";
import { useState } from "react";

import { UseFormReturn } from "react-hook-form";

const DateForm = ({
  form,
  title,
  name,
  date,
  setDate,
  editing,
  changeTime,
  setChangeTime,
}: {
  form: UseFormReturn;
  title: string;
  name: string;
  placeholder: string;
  date: string;
  setDate: (date: string) => void;
  editing: boolean;
  changeTime: boolean;
  setChangeTime: (date: boolean) => void;
}) => {
  // const [changeTime, setChangeTime] = useState<boolean>(false);
  const handleChangeTime = (e: any) => {
    setDate(e.target.value);
    setChangeTime(true);
  };

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{title}</FormLabel>
              <br />
              <input
                id="dateTime"
                type="datetime-local"
                name="partydate"
                value={
                  editing
                    ? changeTime === false
                      ? moment(field.value, formatDateFull)
                          .format(formatDatetime)
                          .toString()
                      : date
                    : date
                }
                disabled={editing && name === "createAt"}
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
          );
        }}
      />
    </>
  );
};

export default DateForm;
