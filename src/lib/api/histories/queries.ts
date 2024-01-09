import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type HistoryId, historyIdSchema } from "@/lib/db/schema/histories";

export const getHistories = async () => {
  const { session } = await getUserAuth();
  const h = await db.history.findMany({ where: {userId: session?.user.id!}});
  return { histories: h };
};

export const getHistoryById = async (id: HistoryId) => {
  const { session } = await getUserAuth();
  const { id: historyId } = historyIdSchema.parse({ id });
  const h = await db.history.findFirst({
    where: { id: historyId, userId: session?.user.id!}});
  return { histories: h };
};

