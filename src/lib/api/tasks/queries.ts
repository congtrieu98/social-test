import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type TaskId,
  taskIdSchema,
  TaskDateParams,
} from "@/lib/db/schema/tasks";
import { ROLE, formatDateAPi } from "@/utils/constant";
import moment from "moment";

export const getTasks = async () => {
  const { session } = await getUserAuth();
  if (session?.user.role === ROLE.ADMIN) {
    const t = await db.task.findMany({
      orderBy: [
        {
          createAt: "desc",
        },
      ],
      include: { user: true, medias: true, history: true },
    });
    return { tasks: t };
  } else {
    const t = await db.task.findMany({
      where: { assignedId: session?.user?.id },
      include: { user: true, medias: true, history: true },
      orderBy: [
        {
          createAt: "desc",
        },
      ],
    });
    return { tasks: t };
  }
};

export const getTaskById = async (id: TaskId) => {
  const { id: taskId } = taskIdSchema.parse({ id });
  const t = await db.task.findFirst({
    where: { id: taskId },
    include: { user: true, medias: true, history: true },
  });
  return { tasks: t };
};

export const getTaskByUserAssign = async (id: string) => {
  const taskByUserAsign = await db.task.findMany({
    where: { assignedId: id },
  });
  return { tasksAssign: taskByUserAsign };
};

export const getTaskByDate = async (input: TaskDateParams) => {
  const { from, to } = input;
  const fromCustom = moment(from).format(formatDateAPi);
  const toCustom = moment(to).format(formatDateAPi);
  const t = await db.task.findMany({
    where: {
      deadlines: {
        gte: fromCustom + "T00:00:00Z",
        lte: toCustom + "T23:59:59Z",
      },
      AND: [
        {
          status: {
            not: "completed",
          },
        },
      ],
    },
  });
  return { taskByDate: t };
};
