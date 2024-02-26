import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const taskDefaultSchema = z.object({
  id: z.string(),
  content: z.string().nullish(),
  jobDetails: z.string().array(),
  date: z.date(),
  userId: z.string(),
})

export interface CompleteTaskDefault extends z.infer<typeof taskDefaultSchema> {
  user: CompleteUser
}

/**
 * relatedTaskDefaultSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTaskDefaultSchema: z.ZodSchema<CompleteTaskDefault> = z.lazy(() => taskDefaultSchema.extend({
  user: relatedUserSchema,
}))
