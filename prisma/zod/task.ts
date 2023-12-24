import * as z from "zod"
import { CompleteTaskUpdate, relatedTaskUpdateSchema, CompleteReport, relatedReportSchema, CompleteUser, relatedUserSchema } from "./index"

export const taskSchema = z.object({
  id: z.string(),
  title: z.string({
    message: 'Vui lòng nhập title'
  }),
  description: z.string().nullish(),
  status: z.string(),
  creator: z.string(),
  createAt: z.date(),
  assignedId: z.string(),
})

export interface CompleteTask extends z.infer<typeof taskSchema> {
  taskUpdates: CompleteTaskUpdate[]
  reports: CompleteReport[]
  user: CompleteUser
}

/**
 * relatedTaskSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTaskSchema: z.ZodSchema<CompleteTask> = z.lazy(() => taskSchema.extend({
  taskUpdates: relatedTaskUpdateSchema.array(),
  reports: relatedReportSchema.array(),
  user: relatedUserSchema,
}))
