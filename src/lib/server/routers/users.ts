import { publicProcedure, router } from "@/lib/server/trpc";
import { getUserById, getUsers } from "@/lib/api/users/queries";
import { userIdSchema } from "@/lib/db/schema/users";

export const usersRouter = router({
  getUsers: publicProcedure.query(async () => {
    return getUsers();
  }),
  getUserById: publicProcedure.input(userIdSchema).query(async ({ input }) => {
    return getUserById(input.id);
  }),
});
