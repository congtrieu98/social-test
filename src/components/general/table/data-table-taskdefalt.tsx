"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableTaskDefault<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const utils = trpc.useContext();
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [filtering, setFiltering] = useState([""]);
  const [rowSelection, setRowSelection] = useState({});

  const onSuccess = async () => {
    await utils.taskDefaults.getTaskDefaults.invalidate();
    router.refresh();
    toast({
      title: "Success",
      description: "Xóa thành công!",
    });
  };
  const { mutate: deleteTaskDeault, isLoading: isDelete } =
    trpc.taskDefaults.deleteTaskDefault.useMutation({
      onSuccess: () => onSuccess(),
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setFiltering,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      // globalFilter: filtering,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter user"
          type="text"
          // value={filtering}
          // onChange={(e) => setFiltering([e.target.value])}
          value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            return table.getColumn("user")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
      </div>
      <div className="mb-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Xóa</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn xóa user này?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    table.getFilteredSelectedRowModel().rows.map((item) => {
                      deleteTaskDeault({
                        //@ts-ignore
                        id: item.original.id,
                      });
                    });
                  }}
                >
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel()?.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </>
  );
}
