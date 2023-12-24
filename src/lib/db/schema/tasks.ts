import { taskSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getTasks } from "@/lib/api/tasks/queries";


// Schema for tasks - used to validate API requests
export const insertTaskSchema = taskSchema.omit({ id: true });

export const insertTaskParams = taskSchema.extend({
  createAt: z.coerce.date()
}).omit({
  id: true,
});

export const updateTaskSchema = taskSchema;

export const updateTaskParams = updateTaskSchema.extend({
  createAt: z.coerce.date()
}).omit({
});

export const taskIdSchema = updateTaskSchema.pick({ id: true });

// Types for tasks - used to type API request params and within Components
export type Task = z.infer<typeof updateTaskSchema>;
export type NewTask = z.infer<typeof insertTaskSchema>;
export type NewTaskParams = z.infer<typeof insertTaskParams>;
export type UpdateTaskParams = z.infer<typeof updateTaskParams>;
export type TaskId = z.infer<typeof taskIdSchema>["id"];

// this type infers the return from getTasks() - meaning it will include any joins
export type CompleteTask = Awaited<ReturnType<typeof getTasks>>["tasks"][number];

