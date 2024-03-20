"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import WeeklyWorkModal from "../WeeklyWorkModal";
import moment from "moment";
import { formatDatetime } from "@/utils/constant";

type weeklyWorksDefault = {
  id: string;
  username: string;
  content: string;
  createdAt: Date;
};
export const columnsWeeklyDefault: ColumnDef<weeklyWorksDefault[]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
  },
  {
    accessorKey: "username",
    header: "Người thực hiện",
  },
  {
    accessorKey: "content",
    header: "Nội dung",
  },
  {
    accessorKey: "createdAt",
    header: "Ngày submit",
    cell: ({ row }) => {
      const date = row.getValue("createdAt")
      //@ts-ignore
      return moment(date, formatDatetime).format(formatDatetime);
    },
  },
];
