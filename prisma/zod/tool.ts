import * as z from "zod"
import { CompleteWeeklyWork, relatedWeeklyWorkSchema } from "./index"

export const toolSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  weeklyWorkId: z.string(),
  quantityRemaining: z.string(),
})

export interface CompleteTool extends z.infer<typeof toolSchema> {
  weeklyWork: CompleteWeeklyWork
}

/**
 * relatedToolSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedToolSchema: z.ZodSchema<CompleteTool> = z.lazy(() => toolSchema.extend({
  weeklyWork: relatedWeeklyWorkSchema,
}))
