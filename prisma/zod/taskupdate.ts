import * as z from "zod";
import {
  CompleteTask,
  relatedTaskSchema,
  CompleteUser,
  relatedUserSchema,
} from "./index";

export const todoListchema = z.object({
  id: z.string(),
  status: z.string(),
  updateAt: z.date(),
  taskId: z.string(),
  updateBy: z.string(),
});

export interface CompleteTaskUpdate extends z.infer<typeof todoListchema> {
  task: CompleteTask;
  user: CompleteUser;
}

/**
 * relatedtodoListchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedtodoListchema: z.ZodSchema<CompleteTaskUpdate> = z.lazy(
  () =>
    todoListchema.extend({
      task: relatedTaskSchema,
      user: relatedUserSchema,
    })
);
