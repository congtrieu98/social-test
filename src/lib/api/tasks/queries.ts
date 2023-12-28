import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type TaskId, taskIdSchema } from "@/lib/db/schema/tasks";

export const getTasks = async () => {
  const { session } = await getUserAuth();
  const emailCreator = session?.user?.email
  if (emailCreator === 'trieunguyen2806@gmail.com') {
    const t = await db.task.findMany({ include: { user: true } });
    return { tasks: t };
  } else {
    const t = await db.task.findMany({ where: { assignedId: session?.user?.id }, include: { user: true } });
    return { tasks: t };
  }

};

export const getTaskById = async (id: TaskId) => {
  const { session } = await getUserAuth();
  const { id: taskId } = taskIdSchema.parse({ id });
  const t = await db.task.findFirst({
    where: { id: taskId },
    include: { user: true, taskUpdates: true }
  });
  return { tasks: t };
};

