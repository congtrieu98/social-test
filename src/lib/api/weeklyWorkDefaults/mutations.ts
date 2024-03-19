import { db } from "@/lib/db/index";
import { 
  WeeklyWorkDefaultId, 
  NewWeeklyWorkDefaultParams,
  UpdateWeeklyWorkDefaultParams, 
  updateWeeklyWorkDefaultSchema,
  insertWeeklyWorkDefaultSchema, 
  weeklyWorkDefaultIdSchema 
} from "@/lib/db/schema/weeklyWorkDefaults";

export const createWeeklyWorkDefault = async (weeklyWorkDefault: NewWeeklyWorkDefaultParams) => {
  const newWeeklyWorkDefault = insertWeeklyWorkDefaultSchema.parse(weeklyWorkDefault);
  try {
    const w = await db.weeklyWorkDefault.create({ data: newWeeklyWorkDefault });
    return { weeklyWorkDefault: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateWeeklyWorkDefault = async (id: WeeklyWorkDefaultId, weeklyWorkDefault: UpdateWeeklyWorkDefaultParams) => {
  const { id: weeklyWorkDefaultId } = weeklyWorkDefaultIdSchema.parse({ id });
  const newWeeklyWorkDefault = updateWeeklyWorkDefaultSchema.parse(weeklyWorkDefault);
  try {
    const w = await db.weeklyWorkDefault.update({ where: { id: weeklyWorkDefaultId }, data: newWeeklyWorkDefault})
    return { weeklyWorkDefault: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteWeeklyWorkDefault = async (id: WeeklyWorkDefaultId) => {
  const { id: weeklyWorkDefaultId } = weeklyWorkDefaultIdSchema.parse({ id });
  try {
    const w = await db.weeklyWorkDefault.delete({ where: { id: weeklyWorkDefaultId }})
    return { weeklyWorkDefault: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

