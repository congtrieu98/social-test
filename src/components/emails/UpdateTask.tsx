// 'use client'
 
import { usePathname } from 'next/navigation'
import { CompleteTask } from "@/lib/db/schema/tasks";
import * as React from "react";

interface EmailTemplateProps {
  name: string;
  task: CompleteTask;
}

export const TaskEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  task,
}) => {
  const pathname = usePathname();
  console.log(pathname)
  return (
    <div>
    <p>Công việc <b>{task.title}</b> do <b>{name}</b> thực hiện đã được cập nhật lại trạng thái</p>
    <div>
      Chi tiết xem tại: 
      <a href={`${pathname}/task`}>Click here</a>
    </div>
    <hr />
  </div>
  )
}
