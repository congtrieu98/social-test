import { taskDefaultSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getTaskDefaults } from "@/lib/api/taskDefaults/queries";


// Schema for taskDefaults - used to validate API requests
export const insertTaskDefaultSchema = taskDefaultSchema.omit({ id: true });

export const insertTaskDefaultParams = taskDefaultSchema.extend({
  date: z.coerce.date()
}).omit({ 
  id: true,
  userId: true
});

export const updateTaskDefaultSchema = taskDefaultSchema;

export const updateTaskDefaultParams = updateTaskDefaultSchema.extend({
  date: z.coerce.date()
}).omit({ 
  userId: true
});

export const taskDefaultIdSchema = updateTaskDefaultSchema.pick({ id: true });

// Types for taskDefaults - used to type API request params and within Components
export type TaskDefault = z.infer<typeof updateTaskDefaultSchema>;
export type NewTaskDefault = z.infer<typeof insertTaskDefaultSchema>;
export type NewTaskDefaultParams = z.infer<typeof insertTaskDefaultParams>;
export type UpdateTaskDefaultParams = z.infer<typeof updateTaskDefaultParams>;
export type TaskDefaultId = z.infer<typeof taskDefaultIdSchema>["id"];
    
// this type infers the return from getTaskDefaults() - meaning it will include any joins
export type CompleteTaskDefault = Awaited<ReturnType<typeof getTaskDefaults>>["taskDefaults"][number];

