import { db } from "@/lib/db/index";
import { 
  WeeklyWorkId, 
  NewWeeklyWorkParams,
  UpdateWeeklyWorkParams, 
  updateWeeklyWorkSchema,
  insertWeeklyWorkSchema, 
  weeklyWorkIdSchema 
} from "@/lib/db/schema/weeklyWorks";
import { getUserAuth } from "@/lib/auth/utils";

export const createWeeklyWork = async (weeklyWork: NewWeeklyWorkParams) => {
  const { session } = await getUserAuth();
  const newWeeklyWork = insertWeeklyWorkSchema.parse({ ...weeklyWork, userId: session?.user.id! });
  try {
    const w = await db.weeklyWork.create({ data: newWeeklyWork });
    return { weeklyWork: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateWeeklyWork = async (id: WeeklyWorkId, weeklyWork: UpdateWeeklyWorkParams) => {
  const { session } = await getUserAuth();
  const { id: weeklyWorkId } = weeklyWorkIdSchema.parse({ id });
  const newWeeklyWork = updateWeeklyWorkSchema.parse({ ...weeklyWork, userId: session?.user.id! });
  try {
    const w = await db.weeklyWork.update({ where: { id: weeklyWorkId, userId: session?.user.id! }, data: newWeeklyWork})
    return { weeklyWork: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteWeeklyWork = async (id: WeeklyWorkId) => {
  const { session } = await getUserAuth();
  const { id: weeklyWorkId } = weeklyWorkIdSchema.parse({ id });
  try {
    const w = await db.weeklyWork.delete({ where: { id: weeklyWorkId, userId: session?.user.id! }})
    return { weeklyWork: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

