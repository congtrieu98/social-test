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
import { Badge, Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { formatDateFull, formatDatetime } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import { CompleteTaskUpdate } from "@/lib/db/schema/taskUpdates";
import { useSession } from "next-auth/react";

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
    dataIndex: "user",
    render: (val) => val.name,
  },
  {
    title: "Mô tả",
    dataIndex: "description",
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
    title: "Note",
    dataIndex: "note",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createAt",
    render: (value) => moment(value, formatDateFull).format(formatDatetime),
  },
  {
    title: "Action",
    // dataIndex: 'user',
    render: (record) => <TaskModal task={record} />,
  },
];
export default function TaskList({ tasks }: { tasks: CompleteTask[] }) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession()
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
  const { data: taskUp } = trpc.taskUpdates.getTaskUpdates.useQuery();

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

  const expandedRowRender = (record: CompleteTask) => {
    // console.log(record);
    const data = taskUp?.taskUpdates?.filter(item => item?.taskId === record?.id)
    const columnsTaskUp: ColumnsType<CompleteTaskUpdate> = [
      {
        title: "User",
        key: "user",
        render(record) {
          return (
            record?.user?.name
          );
        }
      },
      {
        title: "Truy cập lúc",
        dataIndex: "updateAt",
        key: "truy cap",
        render: (value) => moment(value, formatDateFull).format(formatDatetime),
      },
      {
        title: "Status",
        key: "state",
        dataIndex: "status",
        render: (val) => <Badge status="success" text={val === 'readed' ? 'Đã xem' : ''} />,
      },
    ];
    return (
      <Table
        columns={columnsTaskUp}
        dataSource={data}
        pagination={false}
      />
    );
  };

  if (t.tasks.length === 0) {
    return <EmptyState />;
  }

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
                  // await getTasks()
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
            rowSelection={['trieunguyen2806@gmail.com', 'khanh@suzu.vn'].some(item => item === session?.user?.email as string) && rowSelection}
            columns={columns}
            // @ts-ignore
            expandable={['trieunguyen2806@gmail.com', 'khanh@suzu.vn'].some(item => item === session?.user?.email as string) && { expandedRowRender }}
            dataSource={t.tasks}
            scroll={{ x: 1200 }}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
}

const EmptyState = () => {
  const { data: session } = useSession()
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new task.
      </p>
      <div className="mt-6">
        {['trieunguyen2806@gmail.com', 'khanh@suzu.vn'].some(item => item === session?.user?.email as string) && <TaskModal emptyState={true} />}
      </div>
    </div>
  );
};
