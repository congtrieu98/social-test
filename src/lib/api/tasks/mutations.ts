import { db } from "@/lib/db/index";
import {
  TaskId,
  NewTaskParams,
  UpdateTaskParams,
  updateTaskSchema,
  insertTaskSchema,
  taskIdSchema,
  UpdateTaskParamsOnlyChecked,
} from "@/lib/db/schema/tasks";
import { getUserAuth } from "@/lib/auth/utils";
import { resend } from "@/lib/email";
import { TaskEmail } from "@/components/emails/TaskEmail";
import { UpdateTask } from "@/components/emails/UpdateTask";
import { getBaseUrl } from "@/lib/trpc/utils";

export const createTask = async (task: NewTaskParams) => {
  const { session } = await getUserAuth();
  const newTask = insertTaskSchema.parse({
    ...task,
    creator: session?.user.id!,
  });
  try {
    const t = await db.task.create({ data: newTask });
    if (t) {
      const user = await db.user.findFirst({ where: { id: t?.assignedId } });
      const baseUrl = getBaseUrl();
      if (user) {
        // @ts-ignore
        const { name, email } = user;
        await resend.emails.send({
          from: `SZG <${process.env.RESEND_EMAIL}>`,
          to: [email as string],
          subject: `Hello ${name}!`,
          // @ts-ignore
          react: TaskEmail({ baseUrl: baseUrl, name: user.name, task: t }),
          text: "Email powered by Resend.",
        });
      }
    }
    const NewTodoList = {
      taskId: t.id,
      isChecked: [] as string[],
    };
    await db.todoList.create({ data: NewTodoList });
    return { task: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTask = async (id: TaskId, task: UpdateTaskParams) => {
  const { id: taskId } = taskIdSchema.parse({ id });
  const newTask = updateTaskSchema.parse({ ...task });
  const baseUrl = getBaseUrl();
  try {
    const t = await db.task.update({
      where: { id: taskId },
      data: newTask,
    });
    const user = await db.user.findFirst({ where: { id: t?.creator } });
    const userAssignded = await db.user.findFirst({
      where: { id: t?.assignedId },
    });
    if (user) {
      // @ts-ignore
      const { name, email } = user;
      await resend.emails.send({
        from: `SZG <${process.env.RESEND_EMAIL}>`,
        to: [email as string],
        subject: `Hello ${name}!`,
        react: UpdateTask({
          baseUrl: baseUrl as string,
          name: userAssignded?.name as string,
          //@ts-ignore
          task: t,
        }),
        text: "Email powered by Resend.",
      });
    }
    return { task: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTaskOnlyChecked = async (
  id: TaskId,
  task: UpdateTaskParamsOnlyChecked
) => {
  const { id: taskId } = taskIdSchema.parse({ id });
  // const newTask = updateTaskSchema.parse({ ...task });
  const t = await db.task.update({
    where: { id: taskId },
    data: task,
  });
  return { task: t };
};

export const deleteTask = async (id: TaskId) => {
  const { session } = await getUserAuth();
  const { id: taskId } = taskIdSchema.parse({ id });
  try {
    const t = await db.task.delete({
      where: { id: taskId, creator: session?.user.id! },
    });
    return { task: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
