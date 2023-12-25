/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { CompleteTask } from "@/lib/db/schema/tasks";
import { trpc } from "@/lib/trpc/client";
import TaskModal from "./TaskModal";
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from "react";



const columns: ColumnsType<CompleteTask> = [
  {
    title: 'Tên công việc',
    dataIndex: 'title',
    // render: (val) => val
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'user',
    render: (val) => val.name,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    // render: (val) => val.name,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (val) => {
      if (val==='new') {
        return "Mới tạo"
      } else if(val==='readed') {
        return "Đã đọc"
      } else if(val==='inprogress') {
        return "Đang thực hiện"
      } else {
        return 'Đã hoàn thành'
      }
    },
  },
  {
    title: 'Action',
    // dataIndex: 'user',
    render: (record) => 
      <TaskModal task={record} />
  },
]
export default function TaskList({ tasks }: { tasks: CompleteTask[] }) {
  const { data: t } = trpc.tasks.getTasks.useQuery(undefined, {
    initialData: { tasks },
    refetchOnMount: false,
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data: datas } = trpc.users.getUsers.useQuery();
  // console.log(datas)

  if (t.tasks.length === 0) {
    return <EmptyState />;
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Table
        id="id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={t.tasks}
      />
    </>
  )

}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new task.
      </p>
      <div className="mt-6">
        <TaskModal emptyState={true} />
      </div>
    </div>
  );
};

