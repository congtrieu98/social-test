"use client";

import StaffModal from "@/components/staffs/staffModal";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
// import ToolModal from "../ToolModal";

type Task = {
  id: string;
  assigndedId: string;
  title: string;
  status: string;
  deadlines: string;
};
export const columns: ColumnDef<Task[]>[] = [
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
    accessorKey: "assigndedId",
    header: "Người thực hiện",
  },
  {
    accessorKey: "title",
    header: "Tên công việc",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    accessorKey: "deadline",
    header: "Ngày hoàn thành",
  },
  // {
  //   accessorKey: "action",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     //@ts-ignore
  //     return <ToolModal tool={row.original} />;
  //   },
  // },
];
