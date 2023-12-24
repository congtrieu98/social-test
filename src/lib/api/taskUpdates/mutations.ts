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
    const t = await db.taskUpdate.create({ data: newTaskUpdate });
    return { taskUpdate: t };
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
    const t = await db.taskUpdate.update({ where: { id: taskUpdateId, userId: session?.user.id! }, data: newTaskUpdate})
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
    const t = await db.taskUpdate.delete({ where: { id: taskUpdateId, userId: session?.user.id! }})
    return { taskUpdate: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

