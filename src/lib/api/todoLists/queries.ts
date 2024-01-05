import { db } from "@/lib/db/index";
import { type TodoListId, todoListIdSchema } from "@/lib/db/schema/todoLists";

export const getTodoLists = async () => {
  const t = await db.todoList.findMany({});
  return { todoLists: t };
};

export const getTodoListById = async (id: TodoListId) => {
  const { id: todoListId } = todoListIdSchema.parse({ id });
  const t = await db.todoList.findFirst({
    where: { id: todoListId}});
  return { todoLists: t };
};

