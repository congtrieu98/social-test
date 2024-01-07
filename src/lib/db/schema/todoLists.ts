import { todoListSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getTodoLists } from "@/lib/api/todoLists/queries";

// Schema for todoLists - used to validate API requests
export const insertTodoListSchema = todoListSchema.omit({ id: true });

export const insertTodoListParams = todoListSchema
  .extend({
    isChecked: z.coerce.string().array(),
  })
  .omit({
    id: true,
    taskId: true,
  });

export const updateTodoListSchema = todoListSchema;

export const updateTodoListParams = updateTodoListSchema.extend({
  isChecked: z.coerce.string().array(),
});

export const todoListIdSchema = updateTodoListSchema.pick({ id: true });

// Types for todoLists - used to type API request params and within Components
export type TodoList = z.infer<typeof updateTodoListSchema>;
export type NewTodoList = z.infer<typeof insertTodoListSchema>;
export type NewTodoListParams = z.infer<typeof insertTodoListParams>;
export type UpdateTodoListParams = z.infer<typeof updateTodoListParams>;
export type TodoListId = z.infer<typeof todoListIdSchema>["id"];

// this type infers the return from getTodoLists() - meaning it will include any joins
export type CompleteTodoList = Awaited<
  ReturnType<typeof getTodoLists>
>["todoLists"][number];
