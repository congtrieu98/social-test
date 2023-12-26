
import * as React from "react";
import { CompleteTask } from "@/lib/db/schema/tasks";

interface EmailTemplateProps {
  name: string;
  task: CompleteTask;
  baseUrl: string;
}

export const UpdateTask: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  task,
  baseUrl
}) => {
  return (
    <div>
      <p>Công việc <b>{task.title}</b> do <b>{name}</b> thực hiện đã được cập nhật lại trạng thái thành: {task.status}</p>
      <div>
        Chi tiết xem: <a href={`${baseUrl}/tasks`}>tại đây</a>
      </div>
      <hr />
    </div>
  )
}
