import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const todoListSchema = z.object({
  id: z.string(),
  content: z.string(),
  isChecked: z.string().array(),
  userId: z.string(),
})

export interface CompleteTodoList extends z.infer<typeof todoListSchema> {
  user: CompleteUser
}

/**
 * relatedTodoListSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTodoListSchema: z.ZodSchema<CompleteTodoList> = z.lazy(() => todoListSchema.extend({
  user: relatedUserSchema,
}))
