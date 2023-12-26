import * as React from "react";
import { CompleteTask } from "@/lib/db/schema/tasks";

interface EmailTemplateProps {
  baseUrl: string;
  name: string;
  task: CompleteTask;
}

export const TaskEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  task,
  baseUrl
}) => {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Bạn vừa nhận được một công việc mới như sau:</p>
      <p>Tên cv: {task.title}</p>
      <div>
        Vui lòng click vào link sau để bắt đầu thực hiện công việc:
        <a href={`${baseUrl}/tasks`}>Click here</a>
      </div>
      <hr />
    </div>
  )
}
