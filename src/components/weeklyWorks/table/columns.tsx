"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import WeeklyWorkModal from "../WeeklyWorkModal";
// import ToolModal from "../ToolModal";

type weeklyWorks = {
  id: string;
  name: string;
};
export const columns: ColumnDef<weeklyWorks[]>[] = [
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
    accessorKey: "name",
    header: "Tên công việc",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      //@ts-ignore
      return <WeeklyWorkModal weeklyWork={row.original} />;
    },
  },
];
