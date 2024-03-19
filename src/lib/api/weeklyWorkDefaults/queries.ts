import { db } from "@/lib/db/index";
import { type WeeklyWorkDefaultId, weeklyWorkDefaultIdSchema } from "@/lib/db/schema/weeklyWorkDefaults";

export const getWeeklyWorkDefaults = async () => {
  const w = await db.weeklyWorkDefault.findMany({});
  return { weeklyWorkDefaults: w };
};

export const getWeeklyWorkDefaultById = async (id: WeeklyWorkDefaultId) => {
  const { id: weeklyWorkDefaultId } = weeklyWorkDefaultIdSchema.parse({ id });
  const w = await db.weeklyWorkDefault.findFirst({
    where: { id: weeklyWorkDefaultId}});
  return { weeklyWorkDefaults: w };
};

