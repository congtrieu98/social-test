import { getReportById, getReports } from "@/lib/api/reports/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  reportIdSchema,
  insertReportParams,
  updateReportParams,
} from "@/lib/db/schema/reports";
import { createReport, deleteReport, updateReport } from "@/lib/api/reports/mutations";

export const reportsRouter = router({
  getReports: publicProcedure.query(async () => {
    return getReports();
  }),
  getReportById: publicProcedure.input(reportIdSchema).query(async ({ input }) => {
    return getReportById(input.id);
  }),
  createReport: publicProcedure
    .input(insertReportParams)
    .mutation(async ({ input }) => {
      return createReport(input);
    }),
  updateReport: publicProcedure
    .input(updateReportParams)
    .mutation(async ({ input }) => {
      return updateReport(input.id, input);
    }),
  deleteReport: publicProcedure
    .input(reportIdSchema)
    .mutation(async ({ input }) => {
      return deleteReport(input.id);
    }),
});
