"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatNo } from "@/utils/constant";

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
}: {
  form: UseFormReturn;
  title: string;
  name: string;
  placeholder: string;
  date: string;
  setDate: (date: string) => void;
  editing: boolean;
}) => {
  const [changeTime, setChangeTime] = useState<boolean>(false);
  const handleChangeTime = (e: any) => {
    setDate(e.target.value);
    setChangeTime(true);

    // if (editing) {
    //   const newCreateAt = moment(form.getValues("createAt"))
    //     .format(formatNo)
    //     .toString();
    //   const newDeadlines = moment(form.getValues("deadlines"))
    //     .format(formatNo)
    //     .toString();

    //   console.log("newCreateAt:", newCreateAt);
    //   console.log("newDeadlines:", newDeadlines);
    //   console.log("value:", e.target.value);

    //   if (newCreateAt !== e.target.value) {
    //     const a = form.setValue("createAt", e.target.value);
    //     // console.log("a:", a);
    //   }

    //   if (newDeadlines !== e.target.value) {
    //     const b = form.setValue("deadlines", e.target.value);
    //     // console.log("b:", b);
    //   }
    // }
  };
  console.log("date:", date);

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
                      ? moment(field.value).format(formatNo).toString()
                      : date
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
          );
        }}
      />
    </>
  );
};

export default DateForm;
