/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { CompleteTask } from "@/lib/db/schema/tasks";
import { trpc } from "@/lib/trpc/client";
import TaskModal from "./TaskModal";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format } from "date-fns";


export default function TaskList({ tasks }: { tasks: CompleteTask[] }) {
  const { data: t } = trpc.tasks.getTasks.useQuery(undefined, {
    initialData: { tasks },
    refetchOnMount: false,
  })

  const { data: datas } = trpc.users.getUsers.useQuery();
  // console.log(datas)

  if (t.tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Tên công việc</TableHead>
            <TableHead className="text-center">Người thực hiện</TableHead>
            <TableHead className="text-center">Mô tả</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Ngày tạo</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {t.tasks.map((task: CompleteTask) => (
            <Task task={task} key={task.id} />
          ))}
        </TableBody>
      </Table>
    </>
  )

}

const Task = ({ task }: { task: CompleteTask }) => {
  return (
    <TableRow>
      <TableCell className="text-center font-medium">{task.title}</TableCell>
      <TableCell className="text-center">{task.user.name}</TableCell>
      <TableCell className="text-center">{task.description}</TableCell>
      <TableCell className="text-center">{task.status}</TableCell>
      <TableCell className="text-center">{'ngày'}</TableCell>
      <TableCell className="text-center">
        {/* @ts-ignore */}
        <TaskModal task={task} />
      </TableCell>
    </TableRow>
  );
};

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

