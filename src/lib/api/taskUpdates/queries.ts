import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type TaskUpdateId, taskUpdateIdSchema } from "@/lib/db/schema/taskUpdates";

export const getTaskUpdates = async () => {
  const { session } = await getUserAuth();
  const t = await db.taskUpdate.findMany({include: {user: true}});
  return { taskUpdates: t };
};

export const getTaskUpdateById = async (id: TaskUpdateId) => {
  const { session } = await getUserAuth();
  const { id: taskUpdateId } = taskUpdateIdSchema.parse({ id });
  const t = await db.taskUpdate.findFirst({
    where: { id: taskUpdateId }
  });
  return { taskUpdates: t };
};

