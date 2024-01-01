import * as z from "zod"

export const reportSchema = z.object({
  id: z.string(),
  assignedTo: z.string(),
  reportDate: z.date(),
  jobCompleted: z.number().int(),
  jobUnfinished: z.number().int(),
  jobCompletedPrecent: z.number().int(),
  jobUnfinishedPercent: z.number().int(),
  kpi: z.string(),
})
