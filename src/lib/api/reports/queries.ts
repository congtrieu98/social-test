import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type ReportId, reportIdSchema } from "@/lib/db/schema/reports";

export const getReports = async () => {
  const { session } = await getUserAuth();
  const r = await db.report.findMany({ where: {userId: session?.user.id!}});
  return { reports: r };
};

export const getReportById = async (id: ReportId) => {
  const { session } = await getUserAuth();
  const { id: reportId } = reportIdSchema.parse({ id });
  const r = await db.report.findFirst({
    where: { id: reportId, userId: session?.user.id!}});
  return { reports: r };
};

