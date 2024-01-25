import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type TaskId, taskIdSchema } from "@/lib/db/schema/tasks";
import { ROLE } from "@/utils/constant";

export const getTasks = async () => {
  const { session } = await getUserAuth();
  if (session?.user.role === ROLE.ADMIN) {
    const t = await db.task.findMany({
      orderBy: [
        {
          createAt: "desc",
        }
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
