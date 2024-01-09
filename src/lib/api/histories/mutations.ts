import { db } from "@/lib/db/index";
import { 
  HistoryId, 
  NewHistoryParams,
  UpdateHistoryParams, 
  updateHistorySchema,
  insertHistorySchema, 
  historyIdSchema 
} from "@/lib/db/schema/histories";
import { getUserAuth } from "@/lib/auth/utils";

export const createHistory = async (history: NewHistoryParams) => {
  const { session } = await getUserAuth();
  const newHistory = insertHistorySchema.parse({ ...history, userId: session?.user.id! });
  try {
    const h = await db.history.create({ data: newHistory });
    return { history: h };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateHistory = async (id: HistoryId, history: UpdateHistoryParams) => {
  const { session } = await getUserAuth();
  const { id: historyId } = historyIdSchema.parse({ id });
  const newHistory = updateHistorySchema.parse({ ...history, userId: session?.user.id! });
  try {
    const h = await db.history.update({ where: { id: historyId, userId: session?.user.id! }, data: newHistory})
    return { history: h };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteHistory = async (id: HistoryId) => {
  const { session } = await getUserAuth();
  const { id: historyId } = historyIdSchema.parse({ id });
  try {
    const h = await db.history.delete({ where: { id: historyId, userId: session?.user.id! }})
    return { history: h };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

