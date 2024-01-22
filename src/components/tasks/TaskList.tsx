/* eslint-disable react-hooks/rules-of-hooks */
"use client";

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
import { Button } from "@/components/ui/button";

import { CompleteTask } from "@/lib/db/schema/tasks";
import { trpc } from "@/lib/trpc/client";
import TaskModal from "./TaskModal";
import moment from "moment";
import { Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { ROLE, formatDateFull, formatDatetime } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Badge } from "../ui/badge";

export default function TaskList({ tasks }: { tasks: CompleteTask[] }) {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: session } = useSession();
  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.tasks.getTasks.invalidate();
    router.refresh();
    toast({
      title: "Success",
      description: `Task ${action}d!`,
      variant: "default",
    });
  };
  const { data: t } = trpc.tasks.getTasks.useQuery(undefined, {
    initialData: { tasks },
  });

  const { mutate: deleteTask, isLoading: isDeleting } =
    trpc.tasks.deleteTask.useMutation({
      onSuccess: () => onSuccess("delete"),
    });
  trpc.users.getUsers.useQuery();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (t.tasks.length === 0) {
    return <EmptyState />;
  }
  // console.log("taskList:", t?.tasks)
  const columns: ColumnsType<CompleteTask> = [
    {
      title: "Tên công việc",
      width: 150,
      render: (record) => {
        return <Link href={`/tasks/${record.id}`}>{record.title}</Link>;
      },
    },
    {
      title: "Người thực hiện",
      dataIndex: ["user", "name"],
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority",
      render: (val) => {
        if (val === "hight") {
          return <Badge variant="destructive">{val}</Badge>;
        } else if (val === "medium") {
          return <Badge variant="secondary">{val}</Badge>;
        } else {
          return <Badge variant="outline">{val}</Badge>;
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (val) => {
        if (val === "new") {
          return "Mới tạo";
        } else if (val === "readed") {
          return "Đã xem";
        } else if (val === "inprogress") {
          return "Đang thực hiện";
        } else if (val === "reject") {
          return "Chưa hoàn thành";
        } else {
          return "Đã hoàn thành";
        }
      },
      filters: [
        {
          text: "Mới tạo",
          value: "new",
        },
        {
          text: "Đã xem",
          value: "readed",
        },
        {
          text: "Đang thực hiện",
          value: "inprogress",
        },
        {
          text: "Chưa hoàn thành",
          value: "reject",
        },
        {
          text: "Đã hoàn thành",
          value: "completed",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      // @ts-ignore
      onFilter: (value: string, record) => record.status === value,
      width: "10%",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "createAt",
      render: (value) => moment(value, formatDateFull).format(formatDatetime),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "deadlines",
      render: (value) => moment(value, formatDateFull).format(formatDatetime),
    },
    {
      title: "Action",
      // dataIndex: 'user',
      render: (record) => <TaskModal task={record} />,
    },
  ];

  return (
    <div className="relative">
      {selectedRowKeys?.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Xóa</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn xóa công việc?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  selectedRowKeys.map((item) =>
                    deleteTask({ id: item as string })
                  );
                  setSelectedRowKeys([]);
                }}
              >
                Ok
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Layout className="layoutContent">
        <Layout.Content>
          <Table
            rowKey="id"
            loading={isDeleting}
            // @ts-ignore
            rowSelection={session?.user.role === ROLE.ADMIN && rowSelection}
            columns={columns}
            // @ts-ignore
            // expandable={session?.user.role === ROLE.ADMIN && { expandedRowRender }}
            dataSource={t.tasks}
            rowClassName="editable-row"
            scroll={{ x: 1200 }}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
}

const EmptyState = () => {
  const { data: session } = useSession();
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new task.
      </p>
      <div className="mt-6">
        {["trieunguyen2806@gmail.com", "khanh@suzu.vn"].some(
          (item) => item === (session?.user?.email as string)
        ) && <TaskModal emptyState={true} />}
      </div>
    </div>
  );
};
