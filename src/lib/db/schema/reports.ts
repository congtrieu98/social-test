import { reportSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getReports } from "@/lib/api/reports/queries";


// Schema for reports - used to validate API requests
export const insertReportSchema = reportSchema.omit({ id: true });

export const insertReportParams = reportSchema.extend({
  reportDate: z.coerce.date()
}).omit({
  id: true,
});

export const updateReportSchema = reportSchema;

export const updateReportParams = updateReportSchema.extend({
  isComplete: z.coerce.boolean(),
  reportDate: z.coerce.date()
}).omit({});

export const reportIdSchema = updateReportSchema.pick({ id: true });

// Types for reports - used to type API request params and within Components
export type Report = z.infer<typeof updateReportSchema>;
export type NewReport = z.infer<typeof insertReportSchema>;
export type NewReportParams = z.infer<typeof insertReportParams>;
export type UpdateReportParams = z.infer<typeof updateReportParams>;
export type ReportId = z.infer<typeof reportIdSchema>["id"];

// this type infers the return from getReports() - meaning it will include any joins
export type CompleteReport = Awaited<ReturnType<typeof getReports>>["reports"][number];

