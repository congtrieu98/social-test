import { taskSchema, tasksInputDateSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getTasks } from "@/lib/api/tasks/queries";

// Schema for tasks - used to validate API requests
export const insertTaskSchema = taskSchema.omit({ id: true });

export const insertTaskParams = taskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({
    id: true,
  });

export const updateTaskSchema = taskSchema;

export const updateTaskParams = updateTaskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({});

export const updateTaskParamsOnlyChecked = updateTaskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({
    status: true,
    title: true,
    description: true,
    creator: true,
    createAt: true,
    deadlines: true,
    priority: true,
    assignedId: true,
  });

export const updateTaskParamsPriority = updateTaskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({
    status: true,
    title: true,
    description: true,
    creator: true,
    createAt: true,
    deadlines: true,
    checked: true,
    assignedId: true,
  });

export const updateTaskParamsStatus = updateTaskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({
    priority: true,
    title: true,
    description: true,
    creator: true,
    createAt: true,
    deadlines: true,
    checked: true,
    assignedId: true,
  });

export const updateTaskParamsTitle = updateTaskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({
    priority: true,
    status: true,
    description: true,
    creator: true,
    createAt: true,
    deadlines: true,
    checked: true,
    assignedId: true,
  });

export const updateTaskParamsDeadline = updateTaskSchema
  .extend({
    createAt: z.coerce.date(),
  })
  .omit({
    priority: true,
    title: true,
    status: true,
    description: true,
    creator: true,
    createAt: true,
    checked: true,
    assignedId: true,
  });

export const taskDateParams = tasksInputDateSchema.extend({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export const taskIdSchema = updateTaskSchema.pick({ id: true });
export const taskTitleSchema = updateTaskSchema.pick({ title: true });
export const taskAssignedIdSchema = updateTaskSchema.pick({ assignedId: true });

// Types for tasks - used to type API request params and within Components
export type Task = z.infer<typeof updateTaskSchema>;
export type NewTask = z.infer<typeof insertTaskSchema>;
export type NewTaskParams = z.infer<typeof insertTaskParams>;
export type UpdateTaskParams = z.infer<typeof updateTaskParams>;
export type UpdateTaskParamsOnlyChecked = z.infer<
  typeof updateTaskParamsOnlyChecked
>;
export type UpdateTaskByPriority = z.infer<typeof updateTaskParamsPriority>;
export type UpdateTaskByStatus = z.infer<typeof updateTaskParamsStatus>;
export type UpdateTaskByTitle = z.infer<typeof updateTaskParamsTitle>;
export type UpdateTaskByDeadline = z.infer<typeof updateTaskParamsDeadline>;
export type TaskDateParams = z.infer<typeof taskDateParams>;
export type TaskId = z.infer<typeof taskIdSchema>["id"];
export type TaskTitle = z.infer<typeof taskTitleSchema>["title"];
export type TasksInputDate = z.infer<typeof tasksInputDateSchema>;

// this type infers the return from getTasks() - meaning it will include any joins
export type CompleteTask = Awaited<
  ReturnType<typeof getTasks>
>["tasks"][number];
