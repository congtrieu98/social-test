import { db } from "@/lib/db/index";
import {
  TaskUpdateId,
  NewTaskUpdateParams,
  UpdateTaskUpdateParams,
  updateTaskUpdateSchema,
  insertTaskUpdateSchema,
  taskUpdateIdSchema
} from "@/lib/db/schema/taskUpdates";
import { getUserAuth } from "@/lib/auth/utils";

export const createTaskUpdate = async (taskUpdate: NewTaskUpdateParams) => {
  const { session } = await getUserAuth();
  const newTaskUpdate = insertTaskUpdateSchema.parse({ ...taskUpdate, userId: session?.user.id! });
  try {
    const checkTaskUp = await db.taskUpdate.findFirst({
      where: { taskId: taskUpdate?.taskId }
    })
    if (checkTaskUp) {
      console.log("11111111111111111111111")
      return null
    } else {
      const t = await db.taskUpdate.create({ data: newTaskUpdate });
      console.log("taskUpppppppppp1111111:", t)
      return { taskUpdate: t };
    }

  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTaskUpdate = async (id: TaskUpdateId, taskUpdate: UpdateTaskUpdateParams) => {
  const { session } = await getUserAuth();
  const { id: taskUpdateId } = taskUpdateIdSchema.parse({ id });
  const newTaskUpdate = updateTaskUpdateSchema.parse({ ...taskUpdate, userId: session?.user.id! });
  try {
    const t = await db.taskUpdate.update({ where: { id: taskUpdateId }, data: newTaskUpdate })
    return { taskUpdate: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTaskUpdate = async (id: TaskUpdateId) => {
  const { session } = await getUserAuth();
  const { id: taskUpdateId } = taskUpdateIdSchema.parse({ id });
  try {
    const t = await db.taskUpdate.delete({ where: { id: taskUpdateId } })
    return { taskUpdate: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

