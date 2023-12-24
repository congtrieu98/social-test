import * as z from "zod"
import { CompleteTask, relatedTaskSchema, CompleteUser, relatedUserSchema } from "./index"

export const taskUpdateSchema = z.object({
  id: z.string(),
  status: z.string(),
  updateAt: z.date(),
  taskId: z.string(),
  updateBy: z.string(),
})

export interface CompleteTaskUpdate extends z.infer<typeof taskUpdateSchema> {
  task: CompleteTask
  user: CompleteUser
}

/**
 * relatedTaskUpdateSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTaskUpdateSchema: z.ZodSchema<CompleteTaskUpdate> = z.lazy(() => taskUpdateSchema.extend({
  task: relatedTaskSchema,
  user: relatedUserSchema,
}))
