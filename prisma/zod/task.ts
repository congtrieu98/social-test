import * as z from "zod";
import {
  CompleteMedia,
  relatedMediaSchema,
  CompleteTodoList,
  relatedTodoListSchema,
  CompleteHistory,
  relatedHistorySchema,
  CompleteUser,
  relatedUserSchema,
} from "./index";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string({
    required_error: "Title field is required",
  }),
  status: z.string(),
  creator: z.string(),
  createAt: z.date(),
  deadlines: z.date(),
  priority: z.string({
    required_error: "Priority field is required",
  }),
  assignedId: z.string({
    required_error: "Assigned field is required",
  }),
  description: z.string().array(),
  checked: z.string().array(),
});

export interface CompleteTask extends z.infer<typeof taskSchema> {
  medias: CompleteMedia[];
  todoList: CompleteTodoList[];
  history: CompleteHistory[];
  user: CompleteUser;
}

/**
 * relatedTaskSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTaskSchema: z.ZodSchema<CompleteTask> = z.lazy(() =>
  taskSchema.extend({
    medias: relatedMediaSchema.array(),
    todoList: relatedTodoListSchema.array(),
    history: relatedHistorySchema.array(),
    user: relatedUserSchema,
  })
);
