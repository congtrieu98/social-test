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
    <h1>Welcome, {name}!</h1>
    <p>Bạn vừa nhận được một công việc mới như sau:</p>
    <p>Tên cv: {task.title}</p>
    <div>
      Vui lòng click vào link sau để bắt đầu thực hiện công việc: 
      <a href={`${pathname}/task`}>Click here</a>
    </div>
    <hr />
  </div>
  )
}
