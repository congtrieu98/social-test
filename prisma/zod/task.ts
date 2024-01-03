import * as z from "zod"
import { CompleteTaskUpdate, relatedTaskUpdateSchema, CompleteMedia, relatedMediaSchema, CompleteUser, relatedUserSchema } from "./index"

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  note: z.string(),
  creator: z.string(),
  createAt: z.date(),
  deadlines: z.date(),
  priority: z.string(),
  assignedId: z.string(),
})

export interface CompleteTask extends z.infer<typeof taskSchema> {
  taskUpdates: CompleteTaskUpdate[]
  medias: CompleteMedia[]
  user: CompleteUser
}

/**
 * relatedTaskSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTaskSchema: z.ZodSchema<CompleteTask> = z.lazy(() => taskSchema.extend({
  taskUpdates: relatedTaskUpdateSchema.array(),
  medias: relatedMediaSchema.array(),
  user: relatedUserSchema,
}))
