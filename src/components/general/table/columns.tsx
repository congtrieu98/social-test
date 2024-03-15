"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatDateSlash } from "@/utils/constant";
import { $Enums } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type TaskDefault = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: $Enums.UserRole;
  };
  id: string;
  content: string | null;
  jobDetails: string[];
  date: Date;
  userId: string;
};
export const columns: ColumnDef<TaskDefault[]>[] = [
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
      // const idRow = row.original
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
    accessorKey: "user",
    header: "Người thực hiện",
  },
  {
    accessorKey: "content",
    header: "Nội dung",
  },
  {
    accessorKey: "date",
    header: "Ngày submit",
  },
];
