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
      const userAssigned = await db.user.findFirst({
        where: { id: t?.assignedId },
      });

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

      if (t?.creator !== t?.assignedId) {
        await novu.trigger("tasks", {
          to: {
            subscriberId: userAssigned?.id as string,
          },
          payload: {
            text: "Bạn có một công việc mới",
            url: `${t?.id}`,
          },
        });
      }
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
  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);
  try {
    const t = await db.task.update({
      where: { id: taskId },
      data: newTask,
    });

    if (t) {
      const user = await db.user.findFirst({ where: { id: t?.creator } });
      const userAssignded = await db.user.findFirst({
        where: { id: t?.assignedId },
      });
      if (t?.creator !== t?.assignedId) {
        await novu.trigger("tasks", {
          to: {
            subscriberId: userAssignded?.id as string,
          },
          payload: {
            text: `Task: ${t?.title}, đã được ${user?.name} thay đổi thông tin`,
            url: `${t?.id}`,
          },
        });
      }
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
  const { session } = await getUserAuth();
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
    if (t?.creator !== t?.assignedId) {
      await novu.trigger("tasks", {
        to: {
          subscriberId:
            session?.user.role === ROLE.ADMIN
              ? (userAsigned?.id as string)
              : (user?.id as string),
        },
        payload: {
          text: `${
            session?.user.role === ROLE.ADMIN ? user?.name : userAsigned?.name
          } ${
            t.status === "readed"
              ? `đã xem task: ${t?.title}`
              : `đã cập nhật trạng thái thành: 
            ${
              t.status === "readed"
                ? "Đã xem"
                : t.status === "inprogress"
                ? "Đang thực hiện"
                : t.status === "reject"
                ? "Chưa hoàn thành"
                : "Đã hoàn thành"
            }
            `
          }`,
          url: `${t?.id}`,
        },
      });
    }
  }
  return { task: t };
};

export const updateTaskByPriority = async (
  id: TaskId,
  task: UpdateTaskByPriority
) => {
  const { session } = await getUserAuth();
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
    if (t?.creator !== t?.assignedId) {
      await novu.trigger("tasks", {
        to: {
          subscriberId:
            session?.user.role === ROLE.ADMIN
              ? (userAsigned?.id as string)
              : (user?.id as string),
        },
        payload: {
          text: `${
            session?.user.role === ROLE.ADMIN ? user?.name : userAsigned?.name
          } đã cập nhật Priority thành: 
        ${
          t.priority === "urgent"
            ? "Cấp thiết"
            : t.priority === "hight"
            ? "Cao"
            : t.priority === "medium"
            ? "Bình thường"
            : "Thấp"
        }`,
          url: `${t?.id}`,
        },
      });
    }
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
