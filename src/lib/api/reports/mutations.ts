import { db } from "@/lib/db/index";
import {
  ReportId,
  NewReportParams,
  UpdateReportParams,
  updateReportSchema,
  insertReportSchema,
  reportIdSchema
} from "@/lib/db/schema/reports";
import { getUserAuth } from "@/lib/auth/utils";

export const createReport = async (report: NewReportParams) => {
  const { session } = await getUserAuth();
  const newReport = insertReportSchema.parse({ ...report });
  try {
    // @ts-ignore
    const r = await db.report.create({ data: newReport });
    return { report: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateReport = async (id: ReportId, report: UpdateReportParams) => {
  const { session } = await getUserAuth();
  const { id: reportId } = reportIdSchema.parse({ id });
  const newReport = updateReportSchema.parse({ ...report, userId: session?.user.id! });
  try {
    const r = await db.report.update({ where: { id: reportId }, data: newReport })
    return { report: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteReport = async (id: ReportId) => {
  const { session } = await getUserAuth();
  const { id: reportId } = reportIdSchema.parse({ id });
  try {
    const r = await db.report.delete({ where: { id: reportId } })
    return { report: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

