import { db } from "@/lib/db/index";
import {
  TaskId,
  NewTaskParams,
  UpdateTaskParams,
  updateTaskSchema,
  insertTaskSchema,
  taskIdSchema,
  UpdateTaskParamsOnlyChecked,
  UpdateTaskByStatus,
  UpdateTaskByPriority,
} from "@/lib/db/schema/tasks";
import { getUserAuth } from "@/lib/auth/utils";
import { resend } from "@/lib/email";
import { UpdateTask } from "@/components/emails/UpdateTask";
import { getBaseUrl } from "@/lib/trpc/utils";
import { ROLE } from "@/utils/constant";
import { Novu, PushProviderIdEnum } from "@novu/node";

export const createTask = async (task: NewTaskParams) => {
  const { session } = await getUserAuth();
  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);
  const newTask = insertTaskSchema.parse({
    ...task,
    creator: session?.user.id!,
  });
  try {
    const t = await db.task.create({ data: newTask });
    if (t) {
      const user = await db.user.findFirst({ where: { id: t?.assignedId } });

      // todo create noti on web chrom

      // await novu.subscribers.setCredentials(
      //   user?.id as string,
      //   PushProviderIdEnum.FCM,
      //   {
      //     deviceTokens: [newTask.tokenNoticafition as string],
      //   }
      // );
      // novu.trigger("push-tasks", {
      //   to: {
      //     subscriberId: user?.id as string,
      //   },
      //   payload: {
      //     title: "You have a new task from push",
      //     body: "body",
      //   },
      // });

      await novu.trigger("tasks", {
        to: {
          subscriberId: user?.id as string,
        },
        payload: {
          text: "You have a new task",
          url: `${t?.id}`,
        },
      });
    }

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
    if (user?.role !== ROLE.ADMIN) {
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
  const t = await db.task.update({
    where: { id: taskId },
    data: task,
  });
  return { task: t };
};

export const updateTaskByStatus = async (
  id: TaskId,
  task: UpdateTaskByStatus
) => {
  const { id: taskId } = taskIdSchema.parse({ id });
  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);
  const t = await db.task.update({
    where: { id: taskId },
    data: task,
  });

  if (t) {
    const user = await db.user.findFirst({ where: { id: t?.creator } });
    const userAsigned = await db.user.findFirst({
      where: { id: t?.assignedId },
    });
    await novu.trigger("tasks", {
      to: {
        subscriberId: user?.id as string,
      },
      payload: {
        text: `${userAsigned?.name} ${
          t.status === "readed"
            ? `đã xem task: ${t?.title}`
            : `đã cập nhật trạng thái thành: ${t.status}`
        }`,
        url: `${t?.id}`,
      },
    });
  }
  return { task: t };
};

export const updateTaskByPriority = async (
  id: TaskId,
  task: UpdateTaskByPriority
) => {
  const { id: taskId } = taskIdSchema.parse({ id });
  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);

  const t = await db.task.update({
    where: { id: taskId },
    data: task,
  });

  if (t) {
    const user = await db.user.findFirst({ where: { id: t?.creator } });
    const userAsigned = await db.user.findFirst({
      where: { id: t?.assignedId },
    });
    await novu.trigger("tasks", {
      to: {
        subscriberId: user?.id as string,
      },
      payload: {
        text: `${userAsigned?.name} đã cập nhật Priority thành: ${t.priority}`,
        url: `${t?.id}`,
      },
    });
  }
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
