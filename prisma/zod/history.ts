import * as z from "zod"
import { CompleteTask, relatedTaskSchema } from "./index"

export const historySchema = z.object({
  id: z.string(),
  content: z.string(),
  action: z.string(),
  taskId: z.string(),
  createAt: z.date(),
  userId: z.string(),
})

export interface CompleteHistory extends z.infer<typeof historySchema> {
  task: CompleteTask
}

/**
 * relatedHistorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedHistorySchema: z.ZodSchema<CompleteHistory> = z.lazy(() => historySchema.extend({
  task: relatedTaskSchema,
}))
