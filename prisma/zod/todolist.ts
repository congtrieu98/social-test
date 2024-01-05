import * as z from "zod"

export const todoListSchema = z.object({
  id: z.string(),
  content: z.string(),
  isChecked: z.boolean().nullish(),
  taskId: z.string(),
})
