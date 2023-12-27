import { taskUpdateSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getTaskUpdates } from "@/lib/api/taskUpdates/queries";


// Schema for taskUpdates - used to validate API requests
export const insertTaskUpdateSchema = taskUpdateSchema.omit({ id: true });

export const insertTaskUpdateParams = taskUpdateSchema.extend({
  updateAt: z.coerce.date()
}).omit({
  id: true,
});

export const updateTaskUpdateSchema = taskUpdateSchema;

export const updateTaskUpdateParams = updateTaskUpdateSchema.extend({
  updateAt: z.coerce.date()
}).omit({
  taskId: true
});

export const taskUpdateIdSchema = updateTaskUpdateSchema.pick({ id: true });

// Types for taskUpdates - used to type API request params and within Components
export type TaskUpdate = z.infer<typeof updateTaskUpdateSchema>;
export type NewTaskUpdate = z.infer<typeof insertTaskUpdateSchema>;
export type NewTaskUpdateParams = z.infer<typeof insertTaskUpdateParams>;
export type UpdateTaskUpdateParams = z.infer<typeof updateTaskUpdateParams>;
export type TaskUpdateId = z.infer<typeof taskUpdateIdSchema>["id"];

// this type infers the return from getTaskUpdates() - meaning it will include any joins
export type CompleteTaskUpdate = Awaited<ReturnType<typeof getTaskUpdates>>["taskUpdates"][number];

