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
import {
  Badge,
  Form,
  Input,
  InputNumber,
  Layout,
  Popconfirm,
  Select,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { formatDateFull, formatDatetime } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: CompleteTask;
  index: number;
  children: React.ReactNode;
}

export default function TaskList({ tasks }: { tasks: CompleteTask[] }) {
  const [form] = Form.useForm();
  const router = useRouter();
  const utils = trpc.useContext();
  const [editingKey, setEditingKey] = useState("");

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

  const [dataSource, setDataSource] = useState(t.tasks);

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

  const isEditing = (record: CompleteTask) => record.id === editingKey;

  if (t.tasks.length === 0) {
    return <EmptyState />;
  }

  const edit = (record: CompleteTask) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Select />;
    console.log(dataIndex)
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Vui lòng nhập ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
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
      // render: (val) => val.name,
      //@ts-ignore
      // editable: true,
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority",
      //@ts-ignore
      editable: true,
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
      //@ts-ignore
      editable: true,
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
      title: "Edit nhanh",
      dataIndex: "operation",
      render: (_: any, record: CompleteTask) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              // onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            fastEdit
          </Typography.Link>
        );
      },
    },
    {
      title: "Action",
      // dataIndex: 'user',
      render: (record) => <TaskModal task={record} />,
    },
  ];

  const mergedColumns = columns.map((col) => {
    //@ts-ignore
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: CompleteTask) => ({
        record,
        //@ts-ignore
        inputType: col.dataIndex === "age" ? "number" : "text",
        //@ts-ignore
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
          <Form form={form} component={false}>
            <Table
              rowKey="id"
              loading={isDeleting}
              // @ts-ignore
              rowSelection={session?.user.role === "ADMIN" && rowSelection}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              //@ts-ignore
              columns={mergedColumns}
              // @ts-ignore
              // expandable={session?.user.role === "ADMIN" && { expandedRowRender }}
              dataSource={dataSource}
              rowClassName="editable-row"
              scroll={{ x: 1200 }}
            />
          </Form>
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
