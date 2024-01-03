import * as z from "zod"
import { CompleteTask, relatedTaskSchema } from "./index"

export const mediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  taskId: z.string(),
})

export interface CompleteMedia extends z.infer<typeof mediaSchema> {
  task: CompleteTask
}

/**
 * relatedMediaSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMediaSchema: z.ZodSchema<CompleteMedia> = z.lazy(() => mediaSchema.extend({
  task: relatedTaskSchema,
}))
