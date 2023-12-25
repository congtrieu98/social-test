import { CompleteTask } from "@/lib/db/schema/tasks";
import * as React from "react";

interface EmailTemplateProps {
  name: string;
  task: CompleteTask
}

export const TaskEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  name, task
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
     Bạn vừa nhận được một công việc mới như sau:
     <p>Tên cv: {task.title}</p>
    </p>
    <hr />
    <p>Sent with help from Resend and Kirimase 😊</p>
  </div>
);
