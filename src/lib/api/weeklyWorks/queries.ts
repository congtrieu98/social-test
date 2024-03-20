import { db } from "@/lib/db/index";

import { type WeeklyWorkId, weeklyWorkIdSchema } from "@/lib/db/schema/weeklyWorks";

export const getWeeklyWorks = async () => {
  const w = await db.weeklyWork.findMany();
  return { weeklyWorks: w };
};

export const getWeeklyWorkById = async (id: WeeklyWorkId) => {
  const { id: weeklyWorkId } = weeklyWorkIdSchema.parse({ id });
  const w = await db.weeklyWork.findFirst({
    where: { id: weeklyWorkId }
  });
  return { weeklyWorks: w };
};

