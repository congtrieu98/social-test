import * as z from "zod"
import { CompleteTool, relatedToolSchema, CompleteUser, relatedUserSchema } from "./index"

export const weeklyWorkSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
})

export interface CompleteWeeklyWork extends z.infer<typeof weeklyWorkSchema> {
  tools: CompleteTool[]
  user: CompleteUser
}

/**
 * relatedWeeklyWorkSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedWeeklyWorkSchema: z.ZodSchema<CompleteWeeklyWork> = z.lazy(() => weeklyWorkSchema.extend({
  tools: relatedToolSchema.array(),
  user: relatedUserSchema,
}))
