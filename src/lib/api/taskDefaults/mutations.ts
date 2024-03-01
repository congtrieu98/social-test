import { db } from "@/lib/db/index";
import {
  TaskDefaultId,
  NewTaskDefaultParams,
  UpdateTaskDefaultParams,
  updateTaskDefaultSchema,
  insertTaskDefaultSchema,
  taskDefaultIdSchema,
} from "@/lib/db/schema/taskDefaults";
import { getUserAuth } from "@/lib/auth/utils";

export const createTaskDefault = async (taskDefault: NewTaskDefaultParams) => {
  const { session } = await getUserAuth();
  const newTaskDefault = insertTaskDefaultSchema.parse({
    ...taskDefault,
    userId: session?.user.id!,
  });
  try {
    const t = await db.taskDefault.create({ data: newTaskDefault });
    return { taskDefault: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTaskDefault = async (
  id: TaskDefaultId,
  taskDefault: UpdateTaskDefaultParams
) => {
  const { session } = await getUserAuth();
  const { id: taskDefaultId } = taskDefaultIdSchema.parse({ id });
  const newTaskDefault = updateTaskDefaultSchema.parse({
    ...taskDefault,
    userId: session?.user.id!,
  });
  try {
    const t = await db.taskDefault.update({
      where: { id: taskDefaultId, userId: session?.user.id! },
      data: newTaskDefault,
    });
    return { taskDefault: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTaskDefault = async (id: TaskDefaultId) => {
  const { session } = await getUserAuth();
  const { id: taskDefaultId } = taskDefaultIdSchema.parse({ id });
  try {
    // const t = await db.taskDefault.delete({ where: { id: taskDefaultId, userId: session?.user.id! }})
    // return { taskDefault: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
