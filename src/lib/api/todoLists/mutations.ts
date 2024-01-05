import { db } from "@/lib/db/index";
import { 
  TodoListId, 
  NewTodoListParams,
  UpdateTodoListParams, 
  updateTodoListSchema,
  insertTodoListSchema, 
  todoListIdSchema 
} from "@/lib/db/schema/todoLists";

export const createTodoList = async (todoList: NewTodoListParams) => {
  const newTodoList = insertTodoListSchema.parse(todoList);
  try {
    const t = await db.todoList.create({ data: newTodoList });
    return { todoList: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateTodoList = async (id: TodoListId, todoList: UpdateTodoListParams) => {
  const { id: todoListId } = todoListIdSchema.parse({ id });
  const newTodoList = updateTodoListSchema.parse(todoList);
  try {
    const t = await db.todoList.update({ where: { id: todoListId }, data: newTodoList})
    return { todoList: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteTodoList = async (id: TodoListId) => {
  const { id: todoListId } = todoListIdSchema.parse({ id });
  try {
    const t = await db.todoList.delete({ where: { id: todoListId }})
    return { todoList: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

