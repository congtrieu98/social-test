"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { CompleteTool } from "@/lib/db/schema/tools";
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
import { toast } from "@/components/ui/use-toast";
import LoadingComponent from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const [rowSelection, setRowSelection] = useState({});

  const { data: t } = trpc.tools.getTools.useQuery();
  const {
    mutate: createWeeklyWorkDefault,
    isLoading: isCreateWeeklyWorkDefault,
  } = trpc.weeklyWorkDefaults.createWeeklyWorkDefault.useMutation({
    onSuccess: async () => {
      await utils.weeklyWorks.getWeeklyWorks.invalidate();
      await utils.weeklyWorkDefaults.getWeeklyWorkDefaults.invalidate();
      toast({
        title: "Success",
        description: "Gửi xác nhận thành công!",
      });
      setRowSelection({});
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex justify-between">
        <div className="mb-2 ml-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default">Xác nhận</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn chắc chắn muốn gửi xác nhận?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      // 1. Không cho chọn cùng lúc 2 việc
                      if (
                        table.getFilteredSelectedRowModel().rows.length >= 2
                      ) {
                        toast({
                          title: "Cảnh báo",
                          description:
                            "Bạn không thể thực hiện cùng lúc 2 việc!",
                          variant: "destructive",
                        });
                      } else if (t?.tools.length! > 0) {
                        // Check dụng cụ

                        // 2. Đã có thì:
                        // 2.1 Check xem có dụng cụ nào hư hỏng hay hết hay không
                        // =>> check status và quantityRemaining
                        // Check dụng cụ theo tên cv
                        // vd: lau kính sẽ có các dụng cụ nào, bón phân cây có dụng cụ nào
                        const nameWorkId: string[] = table
                          .getFilteredSelectedRowModel()
                          .rows.map(
                            (item) =>
                              //@ts-ignore
                              item.original.id
                          );

                        nameWorkId.map((item) => {
                          const toolsByParentId: CompleteTool[] = [];
                          t?.tools.map((cs: CompleteTool) => {
                            if (cs.weeklyWorkId === item) {
                              toolsByParentId.push(cs);
                            }
                          });
                          const statusArr = toolsByParentId.map(
                            (s) => s.status
                          );

                          const quantityArr = toolsByParentId.find(
                            (q) => q.quantityRemaining <= "1"
                          );
                          const checkStatus = statusArr.includes("damaged");

                          if (quantityArr || checkStatus) {
                            toast({
                              title: "Cảnh báo",
                              description:
                                "Có dụng cụ bị hư hỏng hoặc sắp hết, vui lòng kiểm tra lại!",
                              variant: "destructive",
                            });
                          } else {
                            // Nếu có thì k cho submit
                            const contentArray: string[] = [];
                            table
                              .getFilteredSelectedRowModel()
                              .rows.map((item) => {
                                //@ts-ignore
                                contentArray.push(item.original.name);
                              });
                            createWeeklyWorkDefault({
                              username: session?.user.name as string,
                              content: `Đã thực hiện công việc ${contentArray.toString()}`,
                              createdAt: new Date(),
                            });
                          }
                        });
                      } else {
                        // 1. Chưa có thì cảnh báo tạo
                        toast({
                          title: "Cảnh báo",
                          description:
                            "Chưa có dụng cụ nào, hãy click button kiểm tra dụng cụ để tạo!",
                        });
                      }
                    }}
                  >
                    Ok
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        {isCreateWeeklyWorkDefault ? (
          <LoadingComponent>
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
          </LoadingComponent>
        ) : (
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
        )}
      </div>
    </>
  );
}
