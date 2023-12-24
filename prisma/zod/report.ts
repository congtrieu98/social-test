import * as z from "zod"
import { CompleteTask, relatedTaskSchema } from "./index"

export const reportSchema = z.object({
  id: z.string(),
  isComplete: z.boolean(),
  reportDate: z.date(),
  taskId: z.string(),
})

export interface CompleteReport extends z.infer<typeof reportSchema> {
  task: CompleteTask
}

/**
 * relatedReportSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedReportSchema: z.ZodSchema<CompleteReport> = z.lazy(() => reportSchema.extend({
  task: relatedTaskSchema,
}))
