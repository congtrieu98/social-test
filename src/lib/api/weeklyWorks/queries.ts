import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type WeeklyWorkId, weeklyWorkIdSchema } from "@/lib/db/schema/weeklyWorks";

export const getWeeklyWorks = async () => {
  const { session } = await getUserAuth();
  const w = await db.weeklyWork.findMany({ where: {userId: session?.user.id!}});
  return { weeklyWorks: w };
};

export const getWeeklyWorkById = async (id: WeeklyWorkId) => {
  const { session } = await getUserAuth();
  const { id: weeklyWorkId } = weeklyWorkIdSchema.parse({ id });
  const w = await db.weeklyWork.findFirst({
    where: { id: weeklyWorkId, userId: session?.user.id!}});
  return { weeklyWorks: w };
};

