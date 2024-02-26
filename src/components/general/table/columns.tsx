"use client";

import { formatDateSlash } from "@/utils/constant";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type taskDefault = {
  id: string;
  content: string;
  date: Date;
  user: {
    id: string;
    name: string | null;
  };
};

export const columns: ColumnDef<taskDefault>[] = [
  {
    accessorKey: "user",
    header: "Người thực hiện",
    cell: ({ row }) => {
      const user = row.getValue("user");
      //@ts-ignore
      return user?.name;
    },
  },
  {
    accessorKey: "content",
    header: "Nội dung",
  },
  {
    accessorKey: "date",
    header: "Ngày",
    // cell: ({ row }) => {
    //   const date = row.getValue("date");
    //   console.log(date);
    //   //@ts-ignore
    //   // return moment(date, formatDateSlash).format(formatDateSlash);
    // },
  },
];
