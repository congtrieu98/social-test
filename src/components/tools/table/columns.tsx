"use client";

import StaffModal from "@/components/staffs/staffModal";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ToolModal from "../ToolModal";

type Tool = {
  id: string;
  name: string;
  weeklyId: string;
  status: string;
  quantityRemaining: string;
};
export const columns: ColumnDef<Tool[]>[] = [
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
    header: "Tên dụng cụ",
  },
  {
    accessorKey: "weeklyWorkId",
    header: "Thuộc cv",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    accessorKey: "quantityRemaining",
    header: "Số lần",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      //@ts-ignore
      return <ToolModal tool={row.original} />;
    },
  },
];
