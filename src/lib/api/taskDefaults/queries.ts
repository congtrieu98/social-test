import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type TaskDefaultId,
  taskDefaultIdSchema,
} from "@/lib/db/schema/taskDefaults";

export const getTaskDefaults = async () => {
  const { session } = await getUserAuth();
  const t = await db.taskDefault.findMany({
    // where: { userId: session?.user.id! },
    include: { user: true },
  });
  return { taskDefaults: t };
};

export const getTaskDefaultById = async (id: TaskDefaultId) => {
  const { session } = await getUserAuth();
  const { id: taskDefaultId } = taskDefaultIdSchema.parse({ id });
  const t = await db.taskDefault.findFirst({
    where: { id: taskDefaultId, userId: session?.user.id! },
  });
  return { taskDefaults: t };
};
