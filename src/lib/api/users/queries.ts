import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { UserId, userIdSchema } from "@/lib/db/schema/users";

export const getUsers = async () => {
  const { session } = await getUserAuth();
  const u = await db.user.findMany();
  return { users: u };
};

export const getUserById = async (id: UserId) => {
  const { id: userId } = userIdSchema.parse({ id });
  const t = await db.user.findFirst({
    where: { id: userId },
  });
  return { user: t };
};
