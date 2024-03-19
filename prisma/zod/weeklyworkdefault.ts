import * as z from "zod"

export const weeklyWorkDefaultSchema = z.object({
  id: z.string(),
  username: z.string(),
  content: z.string(),
  createdAt: z.date(),
})
