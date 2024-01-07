import * as z from "zod"
import { CompleteTask, relatedTaskSchema } from "./index"

export const todoListSchema = z.object({
  id: z.string(),
  isChecked: z.string().array(),
  taskId: z.string(),
})

export interface CompleteTodoList extends z.infer<typeof todoListSchema> {
  task: CompleteTask
}

/**
 * relatedTodoListSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTodoListSchema: z.ZodSchema<CompleteTodoList> = z.lazy(() => todoListSchema.extend({
  task: relatedTaskSchema,
}))
