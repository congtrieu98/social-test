/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { CompleteTask } from "@/lib/db/schema/tasks";
import { trpc } from "@/lib/trpc/client";
import TaskModal from "./TaskModal";
import moment from 'moment';
import { Layout, Table, Button } from 'antd';;
import type { ColumnsType } from 'antd/es/table';
import { useState } from "react";
import { formatDateFull, formatDatetime } from "@/lib/utils/constant";



const columns: ColumnsType<CompleteTask> = [
  {
    title: 'Tên công việc',
    dataIndex: 'title',
    width: 150,
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'user',
    render: (val) => val.name,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (val) => {
      if (val === 'new') {
        return "Mới tạo"
      } else if (val === 'readed') {
        return "Đã xem"
      } else if (val === 'inprogress') {
        return "Đang thực hiện"
      } else if (val === 'reject') {
        return "Chưa hoàn thành"
      } else {
        return 'Đã hoàn thành'
      }
    },
    filters: [
      {
        text: 'Mới tạo',
        value: 'new',
      },
      {
        text: 'Đã xem',
        value: 'readed',
      },
      {
        text: 'Đang thực hiện',
        value: 'inprogress',
      },
      {
        text: 'Chưa hoàn thành',
        value: 'reject',
      },
      {
        text: 'Đã hoàn thành',
        value: 'completed',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    // @ts-ignore
    onFilter: (value: string, record) => record.status === value,
    width: '10%',
  },
  {
    title: 'Note',
    dataIndex: 'note',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createAt',
    render: (value) => moment(value, formatDateFull).format(formatDatetime)
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
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const extraButton = [
    selectedRowKeys.length > 0 &&
    <Button
      type="primary"
    >Delete</Button>
  ]

  return (
    <Layout className="layoutContent">
      {/* <PageHeader
        ghost={false}
        title={'Delivery order'}
        extra={extraButton}
        className=""
      /> */}
      <Layout.Content>

        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={t.tasks}
          scroll={{ x: 1200 }}
        />
      </Layout.Content>

    </Layout>
    // <>
    //   <Table
    //     rowKey="id"
    //     rowSelection={rowSelection}
    //     columns={columns}
    //     dataSource={t.tasks}
    //     scroll={{ x: 1200 }}
    //   />
    // </>
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

